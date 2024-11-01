import { Router } from 'express';
import { RoomValidationSchema } from '../utils/validationSchema.mjs';
import { checkSchema } from 'express-validator';
import { RoomController, resolveRoomById } from '../controllers/RoomController.mjs';

const router = Router();

// get all rooms
router.get('/get', RoomController.get);

// Add a room
router.post('/post', checkSchema(RoomValidationSchema), RoomController.post);

// Edit a room with patch method
router.patch('/patch/:id', resolveRoomById, router.patch);

// Edit a room with put method
router.put('/put/:id', resolveRoomById, router.put);

// Delete a room
router.delete('/delete/:id', resolveRoomById, router.delete);

export default router;