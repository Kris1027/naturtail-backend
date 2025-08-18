import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  getUsersByRole,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';

const router: Router = Router();

router.get('/users', getAllUsers);
router.get('/users/role/:role', getUsersByRole);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;