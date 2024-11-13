import { Router } from 'express';
import { RoomController } from '../controllers/RoomController.mjs';

const router = Router();

// get all room types
router.get('/', RoomController.getAllRoomsTypes);

export default router;
