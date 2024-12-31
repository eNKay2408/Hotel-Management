import { jest } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';

dotenv.config();

import { RoomController } from '../../../server/src/controllers/RoomController.mjs';
import RoomModel from '../../../server/src/models/RoomModel.mjs';
import connection from '../../../server/src/database/connectSQL.mjs';

const ID_DOES_NOT_EXIST = 999;
const SAMPLE_ROOM = {
  RoomId: 103,
  Type: 'C',
  isAvailable: false,
  Description: 'Test Room',
  ImgUrl: 'https://placehold.co/400',
};

/**
 * Inserts test data into the Room table.
 *
 * This function inserts the following rooms:
 * - RoomID: 101, Type: 'A', IsAvailable: 0 (false), Description: 'Test Room', ImgUrl: 'https://placehold.co/400'
 * - RoomID: 102, Type: 'B', IsAvailable: 1 (true), Description: 'Another Test Room', ImgUrl: 'https://placehold.co/400'
 */
async function insertTestData() {
  await connection.request().query(`
    INSERT INTO ROOM (RoomID, Type, IsAvailable, Description, ImgUrl)
    VALUES (101, 'A', 0, 'Test Room', 'https://placehold.co/400'),
           (102, 'B', 1, 'Another Test Room', 'https://placehold.co/400');
  `);
}

describe('RoomController Integration Tests', () => {
  let req, res;

  beforeAll(async () => {
    try {
      await connection.connect();
      console.log('Database connection established successfully');

      connection.request().query(`
      INSERT INTO ROOMTYPE VALUES 
      ('A', 150, 6, 0.25, 3),
      ('B', 170, 4, 0.25, 2),
      ('C', 200, 2, 0.25, 1)`);
      console.log('Default RoomTypes were inserted successfully');
    } catch (error) {
      console.error('Failed to establish database connection:', error);
    }
  });

  afterAll(async () => {
    await connection.request().query('DELETE FROM ROOM');
    await connection.request().query('DELETE FROM ROOMTYPE');
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
    // Clean up the database after each test
    await connection.request().query('DELETE FROM Room');
    jest.restoreAllMocks();
  });

  describe('getAllRooms', () => {
    it('should return all rooms', async () => {
      await insertTestData();

      await RoomController.getAllRooms(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith([
        {
          Number: 101,
          Type: 'A',
          IsAvailable: false,
          Description: 'Test Room',
          ImgUrl: 'https://placehold.co/400',
        },
        {
          Number: 102,
          Type: 'B',
          IsAvailable: true,
          Description: 'Another Test Room',
          ImgUrl: 'https://placehold.co/400',
        },
      ]);
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal Server Error';
      jest
        .spyOn(RoomModel, 'getAllRooms')
        .mockRejectedValue(new Error(errorMessage));

      await RoomController.getAllRooms(req, res);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('getRoomById', () => {
    it('should return the room with the specified ID', async () => {
      await insertTestData();
      req.params.id = 101;

      await RoomController.getRoomById(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        Number: 101,
        Type: 'A',
        IsAvailable: false,
        Description: 'Test Room',
        ImgUrl: 'https://placehold.co/400',
      });
    });

    it('should return 404 if the room is not found', async () => {
      req.params.id = ID_DOES_NOT_EXIST;
      await RoomController.getRoomById(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith('Room not found');
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal Server Error';
      jest
        .spyOn(RoomModel, 'getRoomById')
        .mockRejectedValue(new Error(errorMessage));

      req.params.id = 1;
      await RoomController.getRoomById(req, res);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('addNewRoom', () => {
    it('should create a new room', async () => {
      req.body = { ...SAMPLE_ROOM };
      await RoomController.addNewRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Room created successfully',
        rowsAffected: [1],
      });

      // Verify the room was added to the database
      const result = await connection
        .request()
        .input('RoomID', SAMPLE_ROOM.RoomId)
        .query('SELECT * FROM Room WHERE RoomID = @RoomID');

      expect(result.recordset).toHaveLength(1);
    });

    it('should return 400 if RoomId and Type fields are missing', async () => {
      req.body = { ...SAMPLE_ROOM };

      //missing 'RoomId' and 'Type' field
      delete req.body.Type;
      delete req.body.RoomId;

      await RoomController.addNewRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith('RoomId and Type are required');
    });

    it('should return 400 if Type field are missing', async () => {
      req.body = { ...SAMPLE_ROOM };
      req.params.id = 103;

      //missing 'Type' field
      delete req.body.Type;

      await RoomController.addNewRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith('RoomId and Type are required');
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal Server Error';
      jest
        .spyOn(RoomModel, 'createRoom')
        .mockRejectedValue(new Error(errorMessage));

      req.body = { ...SAMPLE_ROOM };
      req.params.id = req.body.RoomId;

      await RoomController.addNewRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('updateRoom', () => {
    it('should update the room with the specified ID', async () => {
      await insertTestData();

      // ensure the room exists in the database
      let updatedRoomID = 101;
      const updatedRoom = { ...SAMPLE_ROOM };
      updatedRoom.RoomId = updatedRoomID;
      req.params.id = updatedRoomID;
      req.body = updatedRoom;
      req.body.Description = 'Updated Room Description something blabal';

      await RoomController.updateRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Room updated successfully',
      });
    });

    it('should return 404 if the room is not found', async () => {
      req.params.id = ID_DOES_NOT_EXIST;
      req.body = { ...SAMPLE_ROOM };
      req.body.RoomId = ID_DOES_NOT_EXIST;
      await RoomController.updateRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'No room found' });
    });

    it('should return 400 if missing RoomId and Type fields', async () => {
      //missing 'RoomId' and Type' fields
      req.body = { ...SAMPLE_ROOM };
      delete req.body.Type;
      delete req.body.RoomId;

      await RoomController.updateRoom(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith('RoomId and Type are required');
    });

    it('should return 400 if missing RoomId field', async () => {
      //missing 'RoomId' field
      req.body = { ...SAMPLE_ROOM };
      delete req.body.RoomId;
      await RoomController.updateRoom(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith('RoomId and Type are required');
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal Server Error';
      jest
        .spyOn(RoomModel, 'updateRoom')
        .mockRejectedValue(new Error(errorMessage));

      req.params.id = 103;
      req.body = { ...SAMPLE_ROOM };

      await RoomController.updateRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
  });
});
