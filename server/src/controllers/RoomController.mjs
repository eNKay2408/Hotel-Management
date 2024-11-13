import { StatusCodes } from 'http-status-codes';
import RoomModel from '../models/RoomModel.mjs';
import RoomTypeModel from '../models/RoomTypeModel.mjs';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const RoomController = {
  getAllRooms: async (req, res) => {
    try {
      const rooms = await RoomModel.getAllRooms();
      return res.status(StatusCodes.OK).json(rooms);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },

  getRoomById: async (req, res) => {
    try {
      const { id } = req.params;
      const room = await RoomModel.getRoomById(id);
      if (!room) {
        return res.status(StatusCodes.NOT_FOUND).send('Room not found');
      }
      return res.status(StatusCodes.OK).json(room);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },

  addNewRoom: async (req, res) => {
    try {
      const { RoomId, Type, Status, Description } = req.body;
      let { ImgUrl } = req.body;

      if (!RoomId || !Type) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send('RoomId and Type are required');
      }

      if (Status === null) {
        Status = 'Available';
      }

      if (Description === null) {
        Description = '';
      }

      if (ImgUrl.startsWith('data:image')) {
        const result = await cloudinary.uploader.upload(ImgUrl, {
          folder: 'HotelManagement/Rooms',
        });
        ImgUrl = result.secure_url;
      }

      const room = await RoomModel.createRoom(
        RoomId,
        Type,
        Status,
        Description,
        ImgUrl
      );

      return res.status(StatusCodes.CREATED).json(room);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },

  updateRoom: async (req, res) => {
    try {
      const { id } = req.params;
      const { Type, Status, Description } = req.body;
      let { ImgUrl } = req.body;

      if (ImgUrl.startsWith('data:image')) {
        const result = await cloudinary.uploader.upload(ImgUrl, {
          folder: 'HotelManagement/Rooms',
        });
        ImgUrl = result.secure_url;
      }

      const room = await RoomModel.updateRoom(
        id,
        Type,
        Status,
        Description,
        ImgUrl
      );

      return res.status(StatusCodes.OK).json(room);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },

  deleteRoom: async (req, res) => {
    try {
      const { id } = req.params;
      const room = await RoomModel.deleteRoom(id);
      return res.status(StatusCodes.OK).json(room);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },
  deleteRoom: async (req, res) => {
    try {
      const { id } = req.params;
      const room = await RoomModel.deleteRoom(id);
      return res.status(StatusCodes.OK).json(room);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },

  getAllRoomsTypes: async (req, res) => {
    try {
      const roomTypes = await RoomTypeModel.getAllRoomTypes();
      return res.status(StatusCodes.OK).json(roomTypes);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },
};
