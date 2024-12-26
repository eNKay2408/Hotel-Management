import { jest } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
dotenv.config();

import { CustomerController } from '../../../server/src/controllers/CustomerController.mjs';
import CustomerModel from '../../../server/src/models/CustomerModel.mjs';
import CustomerTypeModel from '../../../server/src/models/CustomerTypeModel.mjs';
import connection from '../../../server/src/database/connectSQL.mjs';

const ID_DOES_NOT_EXIST = 999;
const SAMPLE_CUSTOMER = {
  CustomerId: 1,
  Name: 'John Doe',
  IdentityCard: '123456789',
  Address: 'Test Address',
  Type: 1,
};

async function insertTestData() {
  await connection.request().query(`
    INSERT INTO Customer (CustomerId, Name, IdentityCard, Address, Type)
    VALUES 
      (1, 'John Doe', '123456789', 'Test Address', 1),
      (2, 'Jane Doe', '987654321', 'Another Address', 2);
  `);
}

describe('CustomerController Integration Tests', () => {
  let req, res;

  beforeAll(async () => {
    try {
      await connection.connect();
      console.log('Database connection established successfully');

      await connection.request().query(`
        INSERT INTO [CUSTOMERTYPE] (Name, Coefficient) VALUES
        ('Domestic', 1.0),
        ('Foreign', 1.2);
      `);
      console.log('Default CustomerTypes inserted successfully');
    } catch (error) {
      console.error('Failed to establish database connection:', error);
    }
    await connection.request().query('DELETE FROM Customer');
  });

  afterAll(async () => {
    await connection.request().query('DELETE FROM Customer');
    await connection.request().query('DELETE FROM CUSTOMERTYPE');
    await connection.close();
  });

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  afterEach(async () => {
    await connection.request().query('DELETE FROM Customer');
  });

  describe('getAllCustomerTypes', () => {
    it('should return all customer types with status 200', async () => {
      // Act
      await CustomerController.getAllCustomerTypes(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            Name: 'Domestic',
            Coefficient: 1.0,
          }),
          expect.objectContaining({
            Name: 'Foreign',
            Coefficient: 1.2,
          }),
        ])
      );
    });

    it('should handle errors and return 500 status', async () => {
      // Arrange
      jest
        .spyOn(CustomerTypeModel, 'getAllCustomerTypes')
        .mockRejectedValue(new Error('Database error'));

      // Act
      await CustomerController.getAllCustomerTypes(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith('Database error');
    });
  });

  describe('createNewCustomerType', () => {
    it('should create a new customer type and return 201 status', async () => {
      // Arrange
      req.body = {
        Name: 'Premium',
        Coefficient: 1.5,
      };

      // Act
      await CustomerController.createNewCustomerType(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'CustomerType created successfully',
        })
      );
    });
  });

  describe('updateCustomerType', () => {
    it('should update customer type and return 200 status', async () => {
      // Arrange
      const result = await connection
        .request()
        .query("SELECT Type FROM CUSTOMERTYPE WHERE Name = 'Domestic'");
      const typeId = result.recordset[0].Type;

      req.params = { id: typeId };

      req.body = {
        Name: 'New Type',
        Coefficient: 1.1,
      };

      // Act
      await CustomerController.updateCustomerType(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'CustomerType updated successfully',
        })
      );
    });

    it('should handle non-existent customer type', async () => {
      // Arrange
      req.params = { id: ID_DOES_NOT_EXIST };
      req.body = {
        Name: 'Test',
        Coefficient: 1.0,
      };

      jest
        .spyOn(CustomerTypeModel, 'UpdateCustomerType')
        .mockRejectedValue(new Error('Customer type not found'));

      // Act
      await CustomerController.updateCustomerType(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith('Customer type not found');
    });
  });

  describe('deleteCustomerType', () => {
    beforeEach(async () => {
      // Insert and get a customer type for deletion testing
    });

    it('should delete customer type and return 200 status', async () => {
      // Arrange
      let typeIdToDelete;
      await connection.request().query(`
        INSERT INTO [CUSTOMERTYPE] (Name, Coefficient) VALUES ('ToDelete', 1.0);
      `);
      const result = await connection
        .request()
        .query("SELECT Type FROM CUSTOMERTYPE WHERE Name = 'ToDelete'");
      typeIdToDelete = result.recordset[0].Type;

      req.params = { id: typeIdToDelete };

      // Act
      await CustomerController.deleteCustomerType(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'CustomerType deleted successfully',
        })
      );
    });

    it('should handle deletion of non-existent customer type', async () => {
      // Arrange
      req.params = { id: ID_DOES_NOT_EXIST };
      jest
        .spyOn(CustomerTypeModel, 'DeleteCustomerType')
        .mockRejectedValue(new Error('Customer type not found'));

      // Act
      await CustomerController.deleteCustomerType(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith('Customer type not found');
    });
  });
});
