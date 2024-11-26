import { jest } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';

dotenv.config();

import { RoomController } from '../../../server/src/controllers/RoomController.mjs';
import RoomModel from '../../../server/src/models/RoomModel.mjs';
import connection from '../../../server/src/database/connectSQL.mjs';

const ID_DOES_NOT_EXIST = 999;
const SAMPLE_ROOM = {
  RoomID: 103,
  Type: 'C',
  Status: 0,
  Description: 'Test Room',
  ImgUrl: 'https://placehold.co/400',
};

async function insertTestData() {
  await connection.request().query(`
    INSERT INTO Room (RoomId, Type, Status, Description, ImgUrl)
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
    } catch (error) {
      console.error('Failed to establish database connection:', error);
    }

    // Delete all data from Room table, prepare for testing
    await connection.request().query('DELETE FROM Room');
  });

  // afterAll(async () => {
  //   await connection.close();
  // });

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
  });

  describe('getAllRooms', () => {
    it('should return all rooms', async () => {
      insertTestData();

      await RoomController.getAllRooms(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith([
        {
          RoomID: 101,
          Type: 'A',
          Status: 0,
          Description: 'Test Room',
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
      req.params.id = 102;
      await RoomController.getRoomById(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        RoomID: 102,
        Type: 'B',
        Status: 1,
        Description: 'Another Test Room',
        ImgUrl: 'https://placehold.co/400',
      });
    });

    it('should return 404 if the room is not found', async () => {
      req.params.id = ID_DOES_NOT_EXIST;
      await RoomController.getRoomById(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith('Room not found');
    });

    it('should return 500 if ID is negative', async () => {
      req.params.id = -1;
      await RoomController.getRoomById(req, res);
      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      //res.send may be called with some error messages
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
      req.body = SAMPLE_ROOM;

      await RoomController.addNewRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({ SAMPLE_ROOM });

      // Verify the room was added to the database
      const result = await connection
        .request()
        .input('RoomId', SAMPLE_ROOM.RoomID)
        .query('SELECT * FROM Room WHERE RoomId = @RoomId');
      expect(result.recordset).toHaveLength(1);
      expect(result.recordset[0]).toMatchObject(SAMPLE_ROOM);
    });

    it('should return 400 if required field is missing', async () => {
      req.body = SAMPLE_ROOM;
      //missing 'RoomID' field in req.params.id

      await RoomController.addNewRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);

      //the message may be different, this is just an example
      expect(res.send).toHaveBeenCalledWith('RoomId and Type are required');
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal Server Error';
      jest
        .spyOn(RoomModel, 'createRoom')
        .mockRejectedValue(new Error(errorMessage));

      req.body = SAMPLE_ROOM;

      await RoomController.addNewRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('updateRoom', () => {
    it('should update the room with the specified ID', async () => {
      insertTestData();

      const updatedRoom = SAMPLE_ROOM;
      // ensure the room exists in the database
      updatedRoom.RoomID = 101;

      req.params.id = updatedRoom.RoomID;
      req.body = updatedRoom;

      await RoomController.updateRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ updatedRoom });

      // Verify the room was updated in the database
      const result = await connection
        .request()
        .query('SELECT * FROM Room WHERE RoomId = 101');
      expect(result.recordset).toHaveLength(1);
      expect(result.recordset[0]).toMatchObject(updatedRoom);
    });

    it('should return 404 if the room is not found', async () => {
      req.params.id = ID_DOES_NOT_EXIST;

      req.body = SAMPLE_ROOM;
      await RoomController.updateRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith('Room not found');
    });

    it('should return 400 if missing required fields', async () => {
      req.params.id = 101;

      //missing 'Type' field
      req.body = SAMPLE_ROOM;
      delete req.body.Type;

      await await RoomController.updateRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);

      //the message may be different, this is just an example
      expect(res.send).toHaveBeenCalledWith('No fields to update');
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal Server Error';
      jest
        .spyOn(RoomModel, 'updateRoom')
        .mockRejectedValue(new Error(errorMessage));

      req.params.id = 101;
      req.body = SAMPLE_ROOM;

      await RoomController.updateRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('deleteRoom', () => {
    it('should delete the room with the specified ID', async () => {
      // Insert test data
      insertTestData();

      req.params.id = 101;
      await RoomController.deleteRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Room deleted successfully',
        rowsAffected: [1],
      });

      // Verify the room was deleted from the database
      const result = await connection
        .request()
        .query('SELECT * FROM Room WHERE RoomId = 101');
      expect(result.recordset).toHaveLength(0);
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal Server Error';
      jest
        .spyOn(RoomModel, 'deleteRoom')
        .mockRejectedValue(new Error(errorMessage));

      req.params.id = 101;
      await RoomController.deleteRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('should return 400 if required field is missing', async () => {
    req.body = SAMPLE_ROOM;

    //missing 'RoomID' and 'Type' field
    delete req.body.Type;

    await RoomController.addNewRoom(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);

    //the message may be different, this is just an example
    expect(res.send).toHaveBeenCalledWith('RoomId and Type are required');
  });

  it('should return 404 if the room is not found', async () => {
    req.params.id = ID_DOES_NOT_EXIST;

    await RoomController.deleteRoom(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.send).toHaveBeenCalledWith('Room not found');
  });
});
