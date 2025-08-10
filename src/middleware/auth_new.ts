import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/JwtService';

export const authMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  try {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No auth header or invalid format');
      res.status(401).json({
        success: false,
        message: 'Access token required'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    console.log('Extracted token:', token.substring(0, 50) + '...');
    
    const jwtService = new JwtService();
    console.log('JWT Service created');
    
    const payload = jwtService.verifyToken(token);
    console.log('Token verified successfully:', payload);
    
    // Add user information to request
    (req as any).user = payload;
    console.log('User added to request:', (req as any).user);
    
    next();
  } catch (error) {
    console.log('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
