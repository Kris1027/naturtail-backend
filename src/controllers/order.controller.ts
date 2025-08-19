import { Request, Response } from 'express';
import {
  CreateOrderDTO,
  UpdateOrderDTO,
  OrderStatus,
  PaymentStatus,
  OrderItem,
} from '../types/order.types';
import { settings } from './settings.controller';
import { orderRepository } from '../repositories/order.repository';
import { productRepository } from '../repositories/product.repository';
import { logger } from '../utils/logger';


const calculateShipping = (subtotalCents: number): number => {
  const shippingSettings = settings.shipping;
  
  if (subtotalCents >= shippingSettings.freeShippingThresholdCents) {
    return 0;
  }
  
  if (subtotalCents >= shippingSettings.reducedShippingThresholdCents) {
    return shippingSettings.reducedShippingCents;
  }
  
  return shippingSettings.standardShippingCents;
};

export const createOrder = async (req: Request<{}, {}, CreateOrderDTO>, res: Response) => {
  try {
    const { userId, items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    if (!userId || !items || items.length === 0 || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        requiredFields: ['userId', 'items', 'shippingAddress', 'paymentMethod'],
      });
    }

    // Validate order items
    for (const item of items) {
      if (!item.productId || typeof item.productId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Invalid product ID in order items',
        });
      }
      
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Quantity must be a positive integer',
        });
      }
      
      if (item.quantity > 1000) {
        return res.status(400).json({
          success: false,
          error: 'Quantity exceeds maximum allowed (1000)',
        });
      }
    }

    const orderItems: OrderItem[] = [];
    let subtotalCents = 0;

    for (const item of items) {
      const product = productRepository.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product not found: ${item.productId}`,
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          error: `Product is not available: ${product.name}`,
        });
      }

      const itemTotal = product.priceCents * item.quantity;
      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        priceCents: product.priceCents,
        totalCents: itemTotal,
      });
      subtotalCents += itemTotal;
    }

    const shippingCents = calculateShipping(subtotalCents);
    const totalCents = subtotalCents + shippingCents;

    const newOrder = orderRepository.create({
      userId,
      items: orderItems,
      subtotalCents,
      shippingCents,
      totalCents,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      notes,
    });

    return res.status(201).json({
      success: true,
      data: newOrder,
    });
  } catch (error) {
    logger.error('Error creating order', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = orderRepository.findAll();
    return res.status(200).json({
      success: true,
      data: orders,
      total: orders.length,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const getOrderById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const order = orders.find((o) => o.id === id);

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const getUserOrders = async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const { userId } = req.params;

    const userOrders = orders.filter((o) => o.userId === userId);

    return res.status(200).json({
      success: true,
      data: userOrders,
      total: userOrders.length,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const getOrdersByStatus = async (req: Request<{ status: string }>, res: Response) => {
  try {
    const { status } = req.params;

    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      return res.status(400).json({
        error: 'Invalid order status',
        validStatuses: Object.values(OrderStatus),
      });
    }

    const filteredOrders = orders.filter((o) => o.status === status);

    return res.status(200).json({
      success: true,
      data: filteredOrders,
      total: filteredOrders.length,
    });
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const updateOrder = async (
  req: Request<{ id: string }, {}, UpdateOrderDTO>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const orderIndex = orders.findIndex((o) => o.id === id);

    if (orderIndex === -1) {
      return res.status(404).json({
        error: 'Order not found',
      });
    }

    if (updates.status && !Object.values(OrderStatus).includes(updates.status)) {
      return res.status(400).json({
        error: 'Invalid order status',
        validStatuses: Object.values(OrderStatus),
      });
    }

    if (updates.paymentStatus && !Object.values(PaymentStatus).includes(updates.paymentStatus)) {
      return res.status(400).json({
        error: 'Invalid payment status',
        validStatuses: Object.values(PaymentStatus),
      });
    }

    const updatedOrder: Order = {
      ...orders[orderIndex],
      ...updates,
      updatedAt: new Date(),
    };

    if (updates.status === OrderStatus.DELIVERED && !updatedOrder.deliveredAt) {
      updatedOrder.deliveredAt = new Date();
    }

    orders[orderIndex] = updatedOrder;

    return res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const cancelOrder = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const orderIndex = orders.findIndex((o) => o.id === id);

    if (orderIndex === -1) {
      return res.status(404).json({
        error: 'Order not found',
      });
    }

    const order = orders[orderIndex];

    if (order.status === OrderStatus.DELIVERED) {
      return res.status(400).json({
        error: 'Cannot cancel delivered order',
      });
    }

    if (order.status === OrderStatus.CANCELLED) {
      return res.status(400).json({
        error: 'Order is already cancelled',
      });
    }

    order.status = OrderStatus.CANCELLED;
    order.updatedAt = new Date();

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export { orders };