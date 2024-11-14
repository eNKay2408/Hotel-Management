import { Router } from 'express';
import { BookingController } from '../controllers/BookingController.mjs';
import { RoomController } from '../controllers/RoomController.mjs';

const router = Router();

router.get('/', RoomController.getAllRoomsAvailable);
router.post('/', BookingController.createNewBooking);
export default router;
