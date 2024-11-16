import BookingModel from '../models/BookingModel.mjs';
import customerModel from '../models/CustomerModel.mjs';
import RoomModel from '../models/RoomModel.mjs';
import BookingCustomerModel from '../models/BookingCustomerModel.mjs';
import { StatusCodes } from 'http-status-codes';

export const BookingController = {
  createNewBooking: async (req, res) => {
    //req: {RoomID: , Customers: [{Name:, IdentityCard:, address:, Type:, }, {Name:, IdentityCard:, address:, Type:, }]}
    try {
      const { RoomId, Customers } = req.body;
      const getCurrentDate = () => {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(now.getUTCDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
      };
      // create new booking
      const booking = await BookingModel.createBooking(
        getCurrentDate(),
        RoomId
      );
      //update room status
      await RoomModel.updateRoom(RoomId, null, 0, null, null);
      //get bookingId of the new booking
      const newBookingId = await BookingModel.getTheNewestBookingId();
      //get all customerIds
      var CustomerIds = [];

      //create new customer if not exist
      for (const Customer of Customers) {
        const { Name, IdentityCard, Address, Type } = Customer;
        const CustomerId = await customerModel.getCustomerIdByIdentityCard(
          IdentityCard
        );

        if (CustomerId.length === 0) {
          await customerModel.CreateCustomer(Name, IdentityCard, Address, Type);
          CustomerIds.push(
            (await customerModel.getCustomerIdByIdentityCard(IdentityCard))[0]
          );
        } else {
          CustomerIds.push(CustomerId[0]);
        }
      }

      //create new bookingCustomer for each customer
      for (const CustomerId of CustomerIds) {
        await BookingCustomerModel.CreateBookingCustomer(
          newBookingId[0].BookingId,
          CustomerId.CustomerId
        );
      }

      return res.status(StatusCodes.CREATED).json(booking);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },
};
