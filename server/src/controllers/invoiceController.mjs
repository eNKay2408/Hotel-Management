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

  createInvoice: async (req, res) => {
    try {
      const { Bookings, RepresentativeId } = req.body;
      const invoice = await InvoiceModel.CreateInvoice(
        Bookings,
        RepresentativeId
      );
      
      return res.status(StatusCodes.CREATED).json(invoice);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },

  getInvoiceInfo: async (req, res) => {
    try {
      const { InvoiceId } = req.params;
      const invoice = await InvoiceModel.getInvoiceInfo(InvoiceId);
      return res.status(StatusCodes.OK).json(invoice);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  }
};
