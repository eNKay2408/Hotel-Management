import { BookingController } from '../controllers/BookingController.mjs';
import { Router } from 'express';

const router = Router();

router.get('/', BookingController.getAllCustomersInBooking);

export default router;