import { jest } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';

dotenv.config();

import { BookingController } from '../../../server/src/controllers/BookingController.mjs';
import BookingModel from '../../../server/src/models/BookingModel.mjs';
import customerModel from '../../../server/src/models/CustomerModel.mjs';
import RoomModel from '../../../server/src/models/RoomModel.mjs';
import BookingCustomerModel from '../../../server/src/models/BookingCustomerModel.mjs';
import connection from '../../../server/src/database/connectSQL.mjs';

const SAMPLE_BOOKING = {
  RoomId: 101,
  Customers: [
    {
      Name: 'Tên Việt',
      IdentityCard: '123456789',
      Address: '123 Phú Mỹ Hưng Quận Gò Vấp',
      Type: 1,
    },
    {
      Name: 'English Name',
      IdentityCard: '987654321',
      Address: '456 Elm St',
      Type: 2,
    },
  ],
};

async function insertTestData() {
  await connection.request().query(`
    INSERT INTO ROOM (RoomID, Type, IsAvailable, Description, ImgUrl)
    VALUES (101, 'A', 1, 'Test Room', 'https://placehold.co/400'),
           (102, 'B', 1, 'Another Test Room', 'https://placehold.co/400');
  `);
}

describe('BookingController Integration Tests', () => {
  let req, res;

  beforeAll(async () => {
    try {
      await connection.connect();
      console.log('Database connection established successfully');

      await connection.request().query(`
      INSERT INTO ROOMTYPE VALUES 
      ('A', 150, 6, 0.25, 3),
      ('B', 170, 4, 0.25, 2),
      ('C', 200, 2, 0.25, 1)
      
      INSERT INTO ROOM (RoomID, Type) 
      VALUES (101, 'A'), (102, 'B'), (103, 'C');

      INSERT INTO CUSTOMERTYPE VALUES ('domestic', 1), ('foreign', 1.5);
      
      INSERT INTO CUSTOMER
      VALUES (
        N'Hoàng Tiến Huy',
        N'Dĩ An, Bình Dương',
        '066204006779', 1),
        (N'Lebrons James',
        N'Los Angeles, California',
        '066204006779', 2);`);
      console.log(
        'Default RoomTypes, Rooms and Customers were inserted successfully'
      );
    } catch (error) {
      console.error('Failed to establish database connection:', error);
    }
  });

  afterAll(async () => {
    await connection.request().query('DELETE FROM BookingCustomers');
    await connection.request().query('DELETE FROM Booking');
    await connection.request().query('DELETE FROM ROOM');
    await connection.request().query('DELETE FROM Customer');
    await connection.request().query('DELETE FROM ROOMTYPE');
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
    // Clean up the Booking-related records after each test
    await connection.request().query('DELETE FROM BookingCustomers');
    await connection.request().query('DELETE FROM Booking');
  });

  describe('getAllBookingUnpaid (all current bookings)', () => {
    beforeEach(async () => {
      // Create a booking
      req.body = { ...SAMPLE_BOOKING };
      await BookingController.createNewBooking(req, res);
    });

    it('should return all unpaid bookings', async () => {
      //   await insertTestData();

      // Create a booking
      req.body = { ...SAMPLE_BOOKING };
      await BookingController.createNewBooking(req, res);

      await BookingController.getAllBookingUnpaid(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal Server Error';
      jest
        .spyOn(BookingModel, 'getAllBookingUnpaid')
        .mockRejectedValue(new Error(errorMessage));

      await BookingController.getAllBookingUnpaid(req, res);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
  });
});
