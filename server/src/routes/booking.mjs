import { Router } from 'express';
import { BookingController, resolveBookingById } from '../controllers/BookingController.mjs';

const router = Router();

router.get('/get', BookingController.get);

router.get('/get/:id/numberOfCustomer', BookingController.getNumberOfCustomer);

router.post('/post', BookingController.post);

router.patch('/patch/:id', resolveBookingById, BookingController.patch);

export default router;