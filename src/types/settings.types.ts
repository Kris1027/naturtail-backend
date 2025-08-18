export interface ShippingSettings {
  freeShippingThresholdCents: number;
  standardShippingCents: number;
  expressShippingCents: number;
  reducedShippingThresholdCents: number;
  reducedShippingCents: number;
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  currency: string;
  timezone: string;
}

export interface OrderSettings {
  orderNumberPrefix: string;
  allowGuestCheckout: boolean;
  requirePhoneNumber: boolean;
  autoConfirmOrders: boolean;
}

export interface Settings {
  id: string;
  shipping: ShippingSettings;
  store: StoreSettings;
  order: OrderSettings;
  maintenanceMode: boolean;
  updatedAt: Date;
}

export interface UpdateSettingsDTO {
  shipping?: Partial<ShippingSettings>;
  store?: Partial<StoreSettings>;
  order?: Partial<OrderSettings>;
  maintenanceMode?: boolean;
}