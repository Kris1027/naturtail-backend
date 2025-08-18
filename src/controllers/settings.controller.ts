import { Request, Response } from 'express';
import { Settings, UpdateSettingsDTO } from '../types/settings.types';

let settings: Settings = {
  id: '1',
  shipping: {
    freeShippingThresholdCents: 10000,
    standardShippingCents: 999,
    expressShippingCents: 1999,
    reducedShippingThresholdCents: 5000,
    reducedShippingCents: 500,
  },
  store: {
    storeName: 'NaturTail Pet Store',
    storeEmail: 'contact@naturtail.com',
    storePhone: '+1-800-PETS',
    currency: 'USD',
    timezone: 'America/New_York',
  },
  order: {
    orderNumberPrefix: 'ORD',
    allowGuestCheckout: false,
    requirePhoneNumber: false,
    autoConfirmOrders: false,
  },
  maintenanceMode: false,
  updatedAt: new Date(),
};

export const getSettings = async (_req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const getShippingSettings = async (_req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: settings.shipping,
    });
  } catch (error) {
    console.error('Error fetching shipping settings:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const updateSettings = async (req: Request<{}, {}, UpdateSettingsDTO>, res: Response) => {
  try {
    const updates = req.body;

    if (updates.shipping) {
      settings.shipping = {
        ...settings.shipping,
        ...updates.shipping,
      };
    }

    if (updates.store) {
      settings.store = {
        ...settings.store,
        ...updates.store,
      };
    }

    if (updates.order) {
      settings.order = {
        ...settings.order,
        ...updates.order,
      };
    }

    if (updates.maintenanceMode !== undefined) {
      settings.maintenanceMode = updates.maintenanceMode;
    }

    settings.updatedAt = new Date();

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const updateShippingSettings = async (
  req: Request<{}, {}, { shipping: Partial<Settings['shipping']> }>,
  res: Response
) => {
  try {
    const { shipping } = req.body;

    if (!shipping) {
      return res.status(400).json({
        error: 'Shipping settings are required',
      });
    }

    settings.shipping = {
      ...settings.shipping,
      ...shipping,
    };
    settings.updatedAt = new Date();

    return res.status(200).json({
      success: true,
      data: settings.shipping,
    });
  } catch (error) {
    console.error('Error updating shipping settings:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const resetSettings = async (_req: Request, res: Response) => {
  try {
    settings = {
      id: '1',
      shipping: {
        freeShippingThresholdCents: 10000,
        standardShippingCents: 999,
        expressShippingCents: 1999,
        reducedShippingThresholdCents: 5000,
        reducedShippingCents: 500,
      },
      store: {
        storeName: 'NaturTail Pet Store',
        storeEmail: 'contact@naturtail.com',
        storePhone: '+1-800-PETS',
        currency: 'USD',
        timezone: 'America/New_York',
      },
      order: {
        orderNumberPrefix: 'ORD',
        allowGuestCheckout: false,
        requirePhoneNumber: false,
        autoConfirmOrders: false,
      },
      maintenanceMode: false,
      updatedAt: new Date(),
    };

    return res.status(200).json({
      success: true,
      message: 'Settings reset to defaults',
      data: settings,
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export { settings };