import { jest } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';

dotenv.config();

import { BookingController } from '../../../server/src/controllers/BookingController.mjs';
import BookingModel from '../../../server/src/models/BookingModel.mjs';
import BookingCustomerModel from '../../../server/src/models/BookingCustomerModel.mjs';
import connection from '../../../server/src/database/connectSQL.mjs';
let SAMPLE_BOOKING = {
  RoomId: 110,
  Customers: [
    {
      Name: 'Tên Việt',
      IdentityCard: '123456789123',
      Address: '123 Phú Mỹ Hưng Quận Gò Vấp',
      Type: 1,
    },
    {
      Name: 'English Name',
      IdentityCard: '987654321000',
      Address: '456 Elm St',
      Type: 2,
    },
  ],
};

const getDomesticId = async () => {
  return await connection
    .request()
    .query("SELECT Type FROM CUSTOMERTYPE WHERE Name = 'domestic'")
    .then((result) => result.recordset[0].Type);
};

const getForeignId = async () => {
  return await connection
    .request()
    .query("SELECT Type FROM CUSTOMERTYPE WHERE Name = 'foreign'")
    .then((result) => result.recordset[0].Type);
};

const NON_EXISTENT_ID = 999;

/**
 * Calculates the expected number of nights based on the current UTC time.
 * The constant is 1 if and only if the current UTC time is within 17:00 and 24:00.
 * This is because Vietnam's hour runs 7 hours faster than UTC time
 * (the calculation happening at the db will use the current date of Vietnam timezone)
 */
const getExpectedNightsResult = () => {
  const currentUTCHour = new Date().getUTCHours();
  return currentUTCHour >= 17 && currentUTCHour < 24 ? 1 : 0;
};
const EXPECTED_NIGHTS_RESULT = getExpectedNightsResult();

describe('BookingController Integration Tests', () => {
  let req, res;

  beforeAll(async () => {
    try {
      await connection.connect();
      console.log('Database connection established successfully');

      await connection.request().query(`
      INSERT INTO ROOMTYPE VALUES 
      ('D', 150, 6, 0.25, 3),
      ('E', 170, 4, 0.25, 2),
      ('F', 200, 2, 0.25, 1)
      
      INSERT INTO ROOM (RoomID, Type) 
      VALUES (110, 'D'), (111, 'E'), (112, 'F');

      INSERT INTO CUSTOMERTYPE VALUES ('domestic', 1), ('foreign', 1.5);
      `);
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

    // Reset room state and customer records
    await connection.request().query('UPDATE ROOM SET IsAvailable = 1');
    await connection.request().query('DELETE FROM Customer');

    jest.restoreAllMocks();
  });

  describe('createNewBooking', () => {
    it('should create a new booking', async () => {
      req.body = { ...SAMPLE_BOOKING };
      req.body.Customers[0].Type = await getDomesticId();
      req.body.Customers[1].Type = await getForeignId();
      await BookingController.createNewBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Booking created successfully',
      });

      // Verify the booking was added to the database
      const result = await connection.request().query('SELECT * FROM Booking');
      expect(result.recordset).toHaveLength(1);
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal Server Error';
      jest
        .spyOn(BookingModel, 'createBooking')
        .mockRejectedValue(new Error(errorMessage));

      req.body = { ...SAMPLE_BOOKING };
      await BookingController.createNewBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith(errorMessage);

      // Verify the booking was not added to the database
      const result = await connection.request().query('SELECT * FROM Booking');
      expect(result.recordset).toHaveLength(0);
    });
  });

  describe('getAllBookingUnpaid (all current bookings)', () => {
    it('should return none when no booking have been made', async () => {
      await BookingController.getAllBookingUnpaid(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);

      const expectedResult = []; // empty array
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    it('should return newly created booking, customers are new', async () => {
      req.body = { ...SAMPLE_BOOKING };

      req.body.Customers[0].Type = await getDomesticId();
      req.body.Customers[1].Type = await getForeignId();

      await BookingController.createNewBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);

      await BookingController.getAllBookingUnpaid(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Booking created successfully',
      });
    });

    it('should return newly created booking, customers have existed', async () => {
      //initial booking, now db has 2 customers
      req.body = { ...SAMPLE_BOOKING };
      req.body.Customers[0].Type = await getDomesticId();
      req.body.Customers[1].Type = await getForeignId();

      await BookingController.createNewBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Booking created successfully',
      });

      req.body = {
        RoomId: 112,
        Customers: [
          {
            Name: 'English Name',
            IdentityCard: '987654321000',
            Address: '456 Elm St',
            Type: await getForeignId(),
          },
        ],
      };

      await BookingController.createNewBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Booking created successfully',
      });

      await BookingController.getAllBookingUnpaid(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);

      expect(res.json).toHaveBeenCalledWith([
        {
          BookingId: expect.any(Number), //auto created by db
          RoomNumber: 110,
          BookingDate: expect.any(Date),
          Nights: EXPECTED_NIGHTS_RESULT,
          Price: 150,
        },
        {
          BookingId: expect.any(Number), //auto created by db
          RoomNumber: 112,
          BookingDate: expect.any(Date),
          Nights: EXPECTED_NIGHTS_RESULT,
          Price: 200,
        },
      ]);
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

  describe('getAllCustomersInBooking', () => {
    it('should return all customers in the specified booking', async () => {
      // Create a booking and add customers

      req.body = { ...SAMPLE_BOOKING };
      await BookingController.createNewBooking(req, res);

      // Get the booking ID
      const bookingResult = await connection
        .request()
        .query('SELECT BookingID FROM Booking WHERE RoomID = 110');
      const bookingId = bookingResult.recordset[0].BookingID;

      req.query.bookingId = bookingId;
      await BookingController.getAllCustomersInBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 404 if the booking is not found', async () => {
      req.query.bookingId = NON_EXISTENT_ID; // Assuming 999 is an ID that doesn't exist
      await BookingController.getAllCustomersInBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith({ message: 'Booking not found' });
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal Server Error';
      jest
        .spyOn(BookingCustomerModel, 'getCustomersInBooking')
        .mockRejectedValue(new Error(errorMessage));

      req.query.bookingId = 1;
      await BookingController.getAllCustomersInBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
  });
});
