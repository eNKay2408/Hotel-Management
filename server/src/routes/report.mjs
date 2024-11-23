import { Router } from "express";
import { ReportController } from "../controllers/ReportController.mjs";

const router = Router();

router.get('/', ReportController.getAllReportOverview);
router.get('/revenue/:month/:year', ReportController.getRevenueReport);
router.get('/occupancy/:month/:year', ReportController.getOccupancyReport);

export default router;