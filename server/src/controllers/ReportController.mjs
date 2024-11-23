import { StatusCodes } from 'http-status-codes';
import ReportModel from '../models/ReportModel.mjs';

export const ReportController = {
  getAllReportOverview: async (req, res) => {
    try {
      const report = await ReportModel.getAllReportOverview();
      return res.status(StatusCodes.OK).json(report);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },

  getRevenueReport: async (req, res) => {
    try {
      const { month, year } = req.params;
      const report = await ReportModel.getRevenueReport(month, year);
      return res.status(StatusCodes.OK).json(report);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },

  getOccupancyReport: async (req, res) => {
    try {
      const { month, year } = req.params;
      const report = await ReportModel.getOccupancyReport(month, year);
      return res.status(StatusCodes.OK).json(report);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
  },
};
