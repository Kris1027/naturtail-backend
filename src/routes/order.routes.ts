import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  getOrdersByStatus,
  updateOrder,
  cancelOrder,
} from '../controllers/order.controller';

const router: Router = Router();

router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.get('/orders/user/:userId', getUserOrders);
router.get('/orders/status/:status', getOrdersByStatus);
router.post('/orders', createOrder);
router.put('/orders/:id', updateOrder);
router.put('/orders/:id/cancel', cancelOrder);

export default router;