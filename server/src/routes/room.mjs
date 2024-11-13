import { Router } from 'express';
import { RoomController } from '../controllers/RoomController.mjs';

const router = Router();

// get all rooms
router.get('/', RoomController.getAllRooms);

// get room by id
router.get('/:id', RoomController.getRoomById);

// add a new room
router.post('/', RoomController.addNewRoom);

// update a room
router.put('/:id', RoomController.updateRoom);

// delete a room
router.delete('/:id', RoomController.deleteRoom);

// get all room types
router.get('/types', RoomController.getAllRoomsTypes);

export default router;
