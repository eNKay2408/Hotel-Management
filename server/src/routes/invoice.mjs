import { Router } from 'express';
import { InvoiceController, resolveInvoiceById } from '../controllers/invoiceController.mjs';

const router = Router();

// get all rooms
router.get('/get', InvoiceController.get);

// Add a room
router.post('/post', InvoiceController.post);

// Edit a room with patch method
router.patch('/patch/:id', resolveInvoiceById, InvoiceController.patch);

// Edit a room with put method
router.put('/put/:id', resolveInvoiceById, InvoiceController.put);

// Delete a room
router.delete('/delete/:id', resolveInvoiceById, InvoiceController.delete);

//get all booking belong to an invoice

router.get('/get/:id/booking', InvoiceController.getAllBooking);

export default router;