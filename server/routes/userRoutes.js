import { Router } from 'express';
import { getBookings, getProfile } from '../controllers/userController.js';

const router = Router();

router.get('/profile', getProfile);
router.get('/bookings', getBookings);

export default router;
