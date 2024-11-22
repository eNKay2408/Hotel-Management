import CustomerTypeModel from '../models/CustomerTypeModel.mjs';
import { StatusCodes } from 'http-status-codes';

export const CustomerController = {
  getAllCustomerTypes: async (req, res) => {
    try {
      const customerTypes = await CustomerTypeModel.getAllCustomerTypes();
      return res.status(StatusCodes.OK).json(customerTypes);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },
};
