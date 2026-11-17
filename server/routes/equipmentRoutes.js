import express from 'express';
import {
  getAllEquipment,
  getEquipmentById,
  addEquipment,
  updateEquipment,
  deleteEquipment
} from '../controllers/equipmentController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateEquipment } from '../middleware/validate.js';

const router = express.Router();

// Public / Authenticated read
router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);

// Caretaker only actions
router.post('/', authenticateToken, requireRole('caretaker'), validateEquipment, addEquipment);
router.put('/:id', authenticateToken, requireRole('caretaker'), updateEquipment);
router.delete('/:id', authenticateToken, requireRole('caretaker'), deleteEquipment);

export default router;
