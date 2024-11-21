import { Router } from 'express';
import { BookingController } from '../controllers/BookingController.mjs';
import { InvoiceController } from '../controllers/InvoiceController.mjs';

const router = Router();

router.get('/', BookingController.getAllBookingUnpaid);
router.post('/', InvoiceController.createInvoice);

export default router;
