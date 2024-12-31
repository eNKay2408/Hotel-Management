import { jest } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import { ReportController } from '../../../server/src/controllers/ReportController.mjs';
import ReportModel from '../../../server/src/models/ReportModel.mjs';

describe('ReportController Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  describe('getAllReportOverview', () => {
    it('should return all report overviews', async () => {
      const mockReport = [{ id: 1, name: 'Report 1' }, { id: 2, name: 'Report 2' }];
      jest.spyOn(ReportModel, 'getAllReportOverview').mockResolvedValue(mockReport);

      await ReportController.getAllReportOverview(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockReport);
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal Server Error';
      jest.spyOn(ReportModel, 'getAllReportOverview').mockRejectedValue(new Error(errorMessage));

      await ReportController.getAllReportOverview(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('getRevenueReport', () => {
    it('should return a revenue report for the specified month and year', async () => {
      const mockReport = { totalRevenue: 10000, month: 12, year: 2024 };
      req.query = { month: '12', year: '2024' };
      jest.spyOn(ReportModel, 'getRevenueReport').mockResolvedValue(mockReport);

      await ReportController.getRevenueReport(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockReport);
    });

    it('should return 400 if month or year is missing', async () => {
      req.query = { month: '12' }; // Missing 'year'
      await ReportController.getRevenueReport(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith('Month and year are required');
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal Server Error';
      req.query = { month: '12', year: '2024' };
      jest.spyOn(ReportModel, 'getRevenueReport').mockRejectedValue(new Error(errorMessage));

      await ReportController.getRevenueReport(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('getOccupancyReport', () => {
    it('should return an occupancy report for the specified month and year', async () => {
      const mockReport = { occupancyRate: 85, month: 12, year: 2024 };
      req.query = { month: '12', year: '2024' };
      jest.spyOn(ReportModel, 'getOccupancyReport').mockResolvedValue(mockReport);

      await ReportController.getOccupancyReport(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockReport);
    });

    it('should return 400 if month or year is missing', async () => {
      req.query = { year: '2024' }; // Missing 'month'
      await ReportController.getOccupancyReport(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith('Month and year are required');
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal Server Error';
      req.query = { month: '12', year: '2024' };
      jest.spyOn(ReportModel, 'getOccupancyReport').mockRejectedValue(new Error(errorMessage));

      await ReportController.getOccupancyReport(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
  });
});
