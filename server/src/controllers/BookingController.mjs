import BookingModel from '../models/BookingModel.mjs';
import customerModel from '../models/CustomerModel.mjs';
import { StatusCodes } from 'http-status-codes';

export const BookingController = {
  createNewBooking: async (req, res) => {
    //req: {RoomID: , customer: [{CustomerId:, IdentityCard:, address:, Type:, }, {CustomerId:, IdentityCard:, address:, Type:, }]}
    try {
      const { RoomId, Customers } = req.body;
      console.log(Customers);
      const getCurrentDate = () => {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(now.getUTCDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
      };
      const booking = await BookingModel.createBooking(
        getCurrentDate(),
        RoomId
      );

      const newBookingId = await BookingModel.getTheNewestBookingId();
      let CustomersId = [];

      for (const Customer of Customers) {
        const { Name, IdentityCard, Address, Type } = Customer;
        console.log(Customer);
        await customerModel.CreateCustomer(Name, IdentityCard, Address, Type);
        const newCustomerId = await customerModel.getCustomerIdByIdentityCard();
        CustomersId.push(newCustomerId);
      }

      for (const CustomerId of CustomersId) {
        await BookingModel.createBookingCustomer(newBookingId, CustomerId);
      }

      return res.status(StatusCodes.CREATED).json(booking);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },
};
