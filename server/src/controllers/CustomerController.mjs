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

  createNewCustomerType: async (req, res) => {
    const { Name, Coefficient } = req.body;
    try {
      const customerType = await CustomerTypeModel.CreateCustomerType(
        Name,
        Coefficient
      );
      return res.status(StatusCodes.CREATED).json(customerType);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },

  updateCustomerType: async (req, res) => {
    const { id } = req.params;
    const { Name, Coefficient } = req.body;
    try {
      const customerType = await CustomerTypeModel.UpdateCustomerType(
        id,
        Name,
        Coefficient
      );
      return res.status(StatusCodes.OK).json(customerType);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },

  deleteCustomerType: async (req, res) => {
    const { id } = req.params;
    try {
      const customerType = await CustomerTypeModel.DeleteCustomerType(id);
      return res.status(StatusCodes.OK).json(customerType);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },
};
