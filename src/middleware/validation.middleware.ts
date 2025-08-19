import { Request, Response, NextFunction } from 'express';

export const validateEmail = (email: string): boolean => {
  // More comprehensive email regex based on RFC 5322
  // Allows most common valid email formats while still catching obvious errors
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Additional validation rules
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Check length constraints
  if (email.length > 254) {
    return false;
  }
  
  // Check local part length (before @)
  const parts = email.split('@');
  if (parts.length !== 2 || parts[0].length > 64) {
    return false;
  }
  
  // No consecutive dots
  if (email.includes('..')) {
    return false;
  }
  
  // Must not start or end with a dot
  if (email.startsWith('.') || email.endsWith('.')) {
    return false;
  }
  
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