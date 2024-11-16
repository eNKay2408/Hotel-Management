import { StatusCodes } from 'http-status-codes';
import InvoiceModel from '../models/InvoiceModel.mjs';
import BookingModel from '../models/BookingModel.mjs';

export const InvoiceController = {
  getAllBookingUnpaid: async (req, res) => {
    try {
      const invoices = await BookingModel.getAllBookingUnpaid();
      return res.status(StatusCodes.OK).json(invoices);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },
};
