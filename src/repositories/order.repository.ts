import { Order, UpdateOrderDTO, OrderStatus, PaymentStatus, OrderItem, PaymentMethod, ShippingAddress } from '../types/order.types';
import { generateIdSync } from '../utils/idGenerator';
import { settings } from '../controllers/settings.controller';

class OrderRepository {
  private orders: Order[] = [];

  findAll(): Order[] {
    return [...this.orders];
  }

  findById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  findByOrderNumber(orderNumber: string): Order | undefined {
    return this.orders.find(o => o.orderNumber === orderNumber);
  }

  findByUserId(userId: string): Order[] {
    return this.orders.filter(o => o.userId === userId);
  }

  findByStatus(status: OrderStatus): Order[] {
    return this.orders.filter(o => o.status === status);
  }

  generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    const prefix = settings.order.orderNumberPrefix || 'ORD';
    return `${prefix}-${timestamp}-${random}`;
  }

  create(data: {
    userId: string;
    items: OrderItem[];
    subtotalCents: number;
    shippingCents: number;
    totalCents: number;
    shippingAddress: ShippingAddress;
    billingAddress?: ShippingAddress;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Order {
    const newOrder: Order = {
      id: generateIdSync('order'),
      orderNumber: this.generateOrderNumber(),
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  updateStatus(id: string, status: OrderStatus): Order | null {
    const order = this.orders.find(o => o.id === id);
    if (!order) {
      return null;
    }

    order.status = status;
    order.updatedAt = new Date();
    return order;
  }

  updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Order | null {
    const order = this.orders.find(o => o.id === id);
    if (!order) {
      return null;
    }

    order.paymentStatus = paymentStatus;
    order.updatedAt = new Date();
    return order;
  }

  update(id: string, data: UpdateOrderDTO): Order | null {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) {
      return null;
    }

    const updatedOrder = {
      ...this.orders[index],
      ...data,
      updatedAt: new Date(),
    };

    this.orders[index] = updatedOrder;
    return updatedOrder;
  }

  delete(id: string): boolean {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) {
      return false;
    }

    this.orders.splice(index, 1);
    return true;
  }

  clear(): void {
    this.orders = [];
  }
}

export const orderRepository = new OrderRepository();