import { BookingController } from '../controllers/BookingController.mjs';
import { Router } from 'express';

const router = Router();

router.post('/', BookingController.getAllCustomersInBooking);

export default router;