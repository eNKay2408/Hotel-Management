import { Router } from 'express';
import { RoomController } from '../controllers/RoomController.mjs';

const router = Router();

// get all room types
router.get('/', RoomController.getAllRoomsTypes);
router.post('/', RoomController.createNewRoomType);
router.put('/:id', RoomController.updateRoomType);
router.delete('/:id', RoomController.deleteRoomType);

export default router;
