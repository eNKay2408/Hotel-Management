import { BookingController } from '../controllers/BookingController.mjs';

const router = Router();

router.post('/:id', BookingController.getAllCustomersInBooking);
