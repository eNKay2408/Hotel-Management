import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController.mjs';

const router = Router();

// get all room types
router.get('/', CustomerController.getAllCustomerTypes);
router.post('/', CustomerController.createNewCustomerType);
router.put('/:Type', CustomerController.updateCustomerType);
router.delete('/:Type', CustomerController.deleteCustomerType);

export default router;
