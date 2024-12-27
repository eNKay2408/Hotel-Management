import { jest } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
dotenv.config();

import { InvoiceController } from '../../../server/src/controllers/InvoiceController.mjs';
import InvoiceModel from '../../../server/src/models/InvoiceModel.mjs';
import BookingModel from '../../../server/src/models/BookingModel.mjs';
import connection from '../../../server/src/database/connectSQL.mjs';

async function insertTestData() {
  // Insert ROOMTYPE data
  await connection.request().query(`
    INSERT INTO ROOMTYPE (Type, Price, Max_Occupancy, Surcharge_Rate, Min_Customer_for_Surcharge)
    VALUES
      ('G', 100, 2, 0.1, 1),
      ('S', 150, 4, 0.15, 2);
  `);

  // Insert ROOM data
  await connection.request().query(`
    INSERT INTO ROOM (RoomID, Type, Status, Description, ImgUrl)
    VALUES
      (101, 'G', 0, 'Room G Description', 'img1.jpg'),
      (102, 'S', 0, 'Room S Description', 'img2.jpg');
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
    INSERT INTO CUSTOMER (CustomerID, CustomerName, Address, IdentityCard, Type)
    VALUES
      (1, 'John Doe', '123 Main St', '123456789012', 1),
      (2, 'Jane Smith', '456 Elm St', '987654321012', 2);
    SET IDENTITY_INSERT CUSTOMER OFF;
  `);

  // Insert BOOKING data
  await connection.request().query(`
    SET IDENTITY_INSERT BOOKING ON;
    INSERT INTO BOOKING (BookingID, RoomID, BookingDate, Cost)
    VALUES
      (1, 101, '2024-12-26', NULL),
      (2, 102, '2024-12-26', NULL);
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
      await connection.connect();
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Failed to establish database connection:', error);
    }
  });

  afterAll(async () => {
    await connection.request().query('DELETE FROM BookingCustomers');
    await connection.request().query('DELETE FROM BOOKING');
    await connection.request().query('DELETE FROM INVOICE');
    await connection.request().query('DELETE FROM CUSTOMER');
    await connection.request().query('DELETE FROM CUSTOMERTYPE');
    await connection.request().query('DELETE FROM ROOM');
    await connection.request().query('DELETE FROM ROOMTYPE');
    await connection.close();
  });

  beforeEach(async () => {
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

    // Clean up test data before each test
    await connection.request().query('DELETE FROM BookingCustomers');
    await connection.request().query('DELETE FROM BOOKING');
    await connection.request().query('DELETE FROM INVOICE');
    await connection.request().query('DELETE FROM CUSTOMER');
    await connection.request().query('DELETE FROM CUSTOMERTYPE');
    await connection.request().query('DELETE FROM ROOM');
    await connection.request().query('DELETE FROM ROOMTYPE');
  });

  afterEach(async () => {
    await connection.request().query('DELETE FROM BookingCustomers');
    await connection.request().query('DELETE FROM BOOKING');
    await connection.request().query('DELETE FROM INVOICE');
    await connection.request().query('DELETE FROM CUSTOMER');
    await connection.request().query('DELETE FROM CUSTOMERTYPE');
    await connection.request().query('DELETE FROM ROOM');
    await connection.request().query('DELETE FROM ROOMTYPE');
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
            BookingId: 1,
            RoomNumber: 101,
            BookingDate: expect.any(Date),
            Nights: 1,
            Price: 100,
          }),
          expect.objectContaining({
            BookingId: 2,
            RoomNumber: 102,
            BookingDate: expect.any(Date),
            Nights: 1,
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

    const mockStatus = jest.fn().mockReturnThis();
    const mockJson = jest.fn().mockReturnThis();
    res.status = mockStatus;
    res.json = mockJson;

    const mockInvoiceId = 1;
    jest.spyOn(InvoiceModel, 'CreateInvoice').mockResolvedValue(mockInvoiceId);

    jest.spyOn(connection.request(), 'query').mockResolvedValue({
      recordset: [{ InvoiceId: mockInvoiceId }],
    });

  
    await InvoiceController.createInvoice(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invoice created successfully',
      invoiceId: mockInvoiceId,
    });
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
    await connection.request().query(`
      SET IDENTITY_INSERT INVOICE ON;
      INSERT INTO INVOICE (InvoiceId, RepresentativeId, InvoiceDate, Amount)
      VALUES (1, 1, '2024-12-26', 250);
      SET IDENTITY_INSERT INVOICE OFF;
    `);

    // Mock the result of the query
    const mockInvoiceData = {
      recordsets: [
        // Invoice details
        [{ InvoiceDate: '2024-12-26', Amount: 250 }],
        
        // Representative details
        [{ Name: 'John Doe', Address: '123 Main St' }],
        
        // Booking details
        [
          {
            RoomNumber: 101,
            Nights: 2,
            Price: 100,
            SurchargeRate: 0.1,
            Amount: 200,
            Coefficient: 1.2,
            ExtraCustomers: 1,
          },
        ],
      ],
    };

    // Mock the connection request to return mockInvoiceData
    connection.request = jest.fn().mockReturnValue({
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue(mockInvoiceData),
    });

    req.params = { InvoiceId: 1 };

    // Act
    await InvoiceController.getInvoiceInfo(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        InvoiceDate: '2024-12-26', // Correct date format
        Representative: {
          Name: 'John Doe',
          Address: '123 Main St',
        },
        Bookings: [
          {
            RoomNumber: 101,
            Nights: 2,
            Price: 100,
            SurchargeRate: 0.1,
            Amount: 200,
            Coefficient: 1.2,
            ExtraCustomers: 1,
          },
        ],
        Amount: 250,
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
