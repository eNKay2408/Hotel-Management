import { jest } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
dotenv.config();

import { InvoiceController } from '../../../server/src/controllers/InvoiceController.mjs';
import InvoiceModel from '../../../server/src/models/InvoiceModel.mjs';
import BookingModel from '../../../server/src/models/BookingModel.mjs';
import connection from '../../../server/src/database/connectSQL.mjs';
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(now.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

async function insertTestData() {
  // Insert BOOKING data
  await connection.request().query(`
    SET IDENTITY_INSERT BOOKING ON;
    INSERT INTO BOOKING (BookingID, RoomID, BookingDate, Cost)
    VALUES
      (1, 301, '${getCurrentDate()}', NULL),
      (2, 302, '${getCurrentDate()}', NULL);
    SET IDENTITY_INSERT BOOKING OFF;
  `);

  // Insert BookingCustomers data
  await connection.request().query(`
    INSERT INTO BookingCustomers (BookingID, CustomerID)
    VALUES
      (1, 1),
      (2, 2);
  `);
}

describe('InvoiceController Integration Tests', () => {
  let req, res;

  beforeAll(async () => {
    try {
      jest.resetAllMocks();
      jest.resetModules();
      await connection.connect();
      console.log('Database connection established successfully');

      // Insert ROOMTYPE data
      await connection.request().query(`
    INSERT INTO ROOMTYPE (Type, Price, Max_Occupancy, Surcharge_Rate, Min_Customer_for_Surcharge)
    VALUES
      ('Z', 100, 2, 0.1, 1),
      ('Y', 150, 4, 0.15, 2);
  `);

      // Insert ROOM data
      await connection.request().query(`
    INSERT INTO ROOM (RoomID, Type, isAvailable, Description, ImgUrl)
    VALUES
      (301, 'Z', 1, 'Room G Description', 'img1.jpg'),
      (302, 'Y', 1, 'Room S Description', 'img2.jpg');
  `);

      // Insert CUSTOMERTYPE data
      await connection.request().query(`
    SET IDENTITY_INSERT CUSTOMERTYPE ON;
    INSERT INTO CUSTOMERTYPE (Type, Name, Coefficient)
    VALUES
      (1, 'Regular', 1.0),
      (2, 'VIP', 1.5);
    SET IDENTITY_INSERT CUSTOMERTYPE OFF;
  `);

      // Insert CUSTOMER data
      await connection.request().query(`
    SET IDENTITY_INSERT CUSTOMER ON;
    INSERT INTO CUSTOMER (CustomerID, Name, Address, IdentityCard, Type)
    VALUES
      (1, 'John Doe', '123 Main St', '123456789012', 1),
      (2, 'Jane Smith', '456 Elm St', '987654321012', 2);
    SET IDENTITY_INSERT CUSTOMER OFF;
  `);
    } catch (error) {
      console.error('Failed to establish database connection:', error);
    }
  });

  afterAll(async () => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.restoreAllMocks();
    jest.clearAllMocks();

    await connection.request().query('DELETE FROM BookingCustomers');
    await connection.request().query('DELETE FROM INVOICE');
    await connection.request().query('DELETE FROM BOOKING');
    await connection.request().query('DELETE FROM CUSTOMER');
    await connection.request().query('DELETE FROM CUSTOMERTYPE');
    await connection.request().query('DELETE FROM ROOM');
    await connection.request().query('DELETE FROM ROOMTYPE');
    await connection.close();
  });

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.restoreAllMocks();
    jest.clearAllMocks();
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

    // // Clean up test data before each test
    // await connection.request().query('DELETE FROM BookingCustomers');
    // await connection.request().query('DELETE FROM BOOKING');
    // await connection.request().query('DELETE FROM INVOICE');
    // await connection.request().query('DELETE FROM CUSTOMER');
    // await connection.request().query('DELETE FROM CUSTOMERTYPE');
    // await connection.request().query('DELETE FROM ROOM');
    // await connection.request().query('DELETE FROM ROOMTYPE');
  });

  afterEach(async () => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.restoreAllMocks();
    jest.clearAllMocks();

    await connection.request().query('DELETE FROM BookingCustomers');
    await connection.request().query('DELETE FROM INVOICE');
    await connection.request().query('DELETE FROM BOOKING');

    // await connection.request().query('DELETE FROM CUSTOMER');
    // await connection.request().query('DELETE FROM CUSTOMERTYPE');
    // await connection.request().query('DELETE FROM ROOM');
    // await connection.request().query('DELETE FROM ROOMTYPE');
  });

  describe('getAllBookingUnpaid', () => {
    it('should return all unpaid bookings with status 200', async () => {
      await insertTestData();

      // Act
      await InvoiceController.getAllBookingUnpaid(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            BookingId: expect.any(Number),
            RoomNumber: 301,
            BookingDate: expect.any(Date),
            Nights: 0,
            Price: 100,
          }),
          expect.objectContaining({
            BookingId: expect.any(Number),
            RoomNumber: 302,
            BookingDate: expect.any(Date),
            Nights: 0,
            Price: 150,
          }),
        ])
      );
    });

    it('should handle errors and return status 500', async () => {
      jest
        .spyOn(BookingModel, 'getAllBookingUnpaid')
        .mockRejectedValue(new Error('Database error'));

      // Act
      await InvoiceController.getAllBookingUnpaid(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith('Database error');
    });
  });

  describe('createInvoice', () => {
    it('should create an invoice and return status 201', async () => {
      // Insert test data or use a real/test database setup
      await insertTestData();

      req.body = {
        Bookings: [1, 2],
        RepresentativeId: 1,
      };

      await InvoiceController.createInvoice(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    });

    it('should handle errors and return status 500', async () => {
      jest
        .spyOn(InvoiceModel, 'CreateInvoice')
        .mockRejectedValue(new Error('Failed to create invoice'));

      req.body = {
        Bookings: [1],
        RepresentativeId: 1,
      };

      // Act
      await InvoiceController.createInvoice(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith('Failed to create invoice');
    });
  });

  describe('getInvoiceInfo', () => {
    it('should return invoice details with status 200', async () => {
      // Insert test data
      await insertTestData();
      //   await connection.request().query(`
      //   SET IDENTITY_INSERT INVOICE ON;
      //   INSERT INTO INVOICE (InvoiceId, RepresentativeId, InvoiceDate, Amount)
      //   VALUES (1, 1, '2024-12-26', 250);
      //   SET IDENTITY_INSERT INVOICE OFF;
      // `);

      req.body = {
        Bookings: [1, 2],
        RepresentativeId: 1,
      };

      await InvoiceController.createInvoice(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      const result = await connection.request().query(`
        select top 1 InvoiceId from Invoice order by InvoiceId desc`);
      const createInvoiceID = result.recordset[0].InvoiceId;
      'createInvoiceID', createInvoiceID;

      req.params = { InvoiceId: createInvoiceID };

      // Act
      await InvoiceController.getInvoiceInfo(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          Amount: 0,
          Bookings: [
            {
              Amount: 0,
              Coefficient: 1,
              ExtraCustomers: 1,
              Nights: 0,
              Price: 100,
              RoomNumber: 301,
              SurchargeRate: 0.1,
            },
            {
              Amount: 0,
              Coefficient: 1.5,
              ExtraCustomers: 0,
              Nights: 0,
              Price: 150,
              RoomNumber: 302,
              SurchargeRate: 0.15,
            },
          ],
          InvoiceDate: expect.any(Date),
          Representative: { Address: '123 Main St', Name: 'John Doe' },
        })
      );
    });

    it('should handle errors and return status 500', async () => {
      jest
        .spyOn(InvoiceModel, 'getInvoiceInfo')
        .mockRejectedValue(new Error('Failed to fetch invoice info'));

      req.params = { InvoiceId: 999 };

      // Act
      await InvoiceController.getInvoiceInfo(req, res);
      // Assert
      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith('Failed to fetch invoice info');
    });
  });
});
