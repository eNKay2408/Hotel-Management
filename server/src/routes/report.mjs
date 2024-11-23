import { Router } from "express";
import { ReportController } from "../controllers/ReportController.mjs";

const router = Router();

router.get('/', ReportController.getAllReportOverview);
router.get('/revenue', ReportController.getRevenueReport);
router.get('/occupancy', ReportController.getOccupancyReport);

export default router;