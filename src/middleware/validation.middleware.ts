import { Request, Response, NextFunction } from 'express';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePositiveInteger = (value: number): boolean => {
  return Number.isInteger(value) && value > 0;
};

export const validateRequiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields = fields.filter((field) => !req.body[field]);
    
    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields',
        requiredFields: missingFields,
      });
      return;
    }
    
    next();
  };
};

export const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};