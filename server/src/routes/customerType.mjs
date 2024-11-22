import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController.mjs';

const router = Router();

// get all room types
router.get('/', CustomerController.getAllCustomerTypes);

export default router;
