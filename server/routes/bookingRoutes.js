import { Router } from 'express';
import {
  createBooking,
  getBookedSeats,
  getBusById,
  getCities,
  getTicket,
  searchBuses
} from '../controllers/bookingController.js';

const router = Router();

router.get('/cities', getCities);
router.post('/search', searchBuses);
router.get('/buses/:id', getBusById);
router.get('/buses/:id/seats', getBookedSeats);
router.post('/book', createBooking);
router.get('/ticket/:transactionId', getTicket);

export default router;
