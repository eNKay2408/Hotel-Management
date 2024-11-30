import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController.mjs';

const router = Router();

// get all room types
router.get('/', CustomerController.getAllCustomerTypes);
router.post('/', CustomerController.createNewCustomerType);
router.put('/:id', CustomerController.updateCustomerType);
router.delete('/:id', CustomerController.deleteCustomerType);

export default router;
