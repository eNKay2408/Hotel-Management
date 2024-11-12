import { StatusCodes } from "http-status-codes";
import RoomModel from "../models/RoomModel.mjs";

export const RoomController = {
    getAllRooms: async (req, res) => {
        try {
            const rooms = await RoomModel.getAllRooms();
            return res.status(StatusCodes.OK).json(rooms);
        } catch (err) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(err.message);
        }
    },

    getRoomById: async (req, res) => {
        try {
            const { id } = req.params;
            const room = await RoomModel.getRoomById(id);
            if (!room) {
                return res.status(StatusCodes.NOT_FOUND).send("Room not found");
            }
            return res.status(StatusCodes.OK).json(room);
        } catch (err) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(err.message);
        }
    },

    addNewRoom: async (req, res) => {
        try {
            if (!req.body.RoomId || !req.body.Type) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .send("RoomId and Type are required");
            }

            if (req.body.Status === null) {
                req.body.Status = "Available";
            }

            if (req.body.Description === null) {
                req.body.Description = "";
            }
            const { RoomId, Type, Status, Description } = req.body;
            const room = await RoomModel.createRoom(
                RoomId,
                Type,
                Status,
                Description
            );
            return res.status(StatusCodes.CREATED).json(room);
        } catch (err) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(err.message);
        }
    },

    updateRoom: async (req, res) => {
        try {
            const { id } = req.params;
            const { Type, Status, Description } = req.body;
            const room = await RoomModel.updateRoom(
                id,
                Type,
                Status,
                Description
            );
            return res.status(StatusCodes.OK).json(room);
        } catch (err) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(err.message);
        }
    },

    deleteRoom: async (req, res) => {
        try {
            const { id } = req.params;
            const room = await RoomModel.deleteRoom(id);
            return res.status(StatusCodes.OK).json(room);
        } catch (err) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(err.message);
        }
    },
};
