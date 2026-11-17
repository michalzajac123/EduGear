import express from 'express';
import {
  getReservations,
  createReservation,
  cancelReservation,
  updateReservationStatus
} from '../controllers/reservationController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateReservation } from '../middleware/validate.js';

const router = express.Router();

// All reservation endpoints require authentication
router.use(authenticateToken);

// GET /api/reservations (students get their own, caretakers get all)
router.get('/', getReservations);

// POST /api/reservations (create reservation with date and conflict validation)
router.post('/', validateReservation, createReservation);

// PATCH /api/reservations/:id/cancel (cancel own reservation or caretaker cancel)
router.patch('/:id/cancel', cancelReservation);

// PATCH /api/reservations/:id/status (caretaker approve/reject/return)
router.patch('/:id/status', requireRole('caretaker'), updateReservationStatus);

export default router;
