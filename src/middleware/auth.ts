import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/JwtService';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 🔴 BREAKPOINT 1: Inicio del middleware
  console.log('=== AUTH MIDDLEWARE EJECUTADO ===');

  try {
    // 🔴 BREAKPOINT 2: Extrayendo headers
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));

    const authHeader = req.headers.authorization;
    console.log('Auth Header extracted:', authHeader);

    // 🔴 BREAKPOINT 3: Validación de header
    if (!authHeader) {
      console.log('ERROR: No authorization header');
      res.status(401).json({
        success: false,
        message: 'Access token required - no auth header'
      });
      return;
    }

    // 🔴 BREAKPOINT 4: Validación de formato Bearer
    if (!authHeader.startsWith('Bearer ')) {
      console.log('ERROR: Invalid authorization format');
      res.status(401).json({
        success: false,
        message: 'Access token required - invalid format'
      });
      return;
    }

    // 🔴 BREAKPOINT 5: Extracción del token
    const token = authHeader.substring(7); // Remove 'Bearer '
    console.log('Token extracted (first 50 chars):', token.substring(0, 50) + '...');

    // 🔴 BREAKPOINT 6: Creación del JWT service
    const jwtService = new JwtService();
    console.log('JWT Service created successfully');

    // 🔴 BREAKPOINT 7: Verificación del token (CRÍTICO)
    const payload = jwtService.verifyToken(token);
    console.log('Token verified successfully. Payload:', payload);

    // 🔴 BREAKPOINT 8: Adición del usuario al request
    (req as any).user = {
      userId: payload.userId,
      email: payload.email
    };
    console.log('User added to request:', (req as any).user);

    // 🔴 BREAKPOINT 9: Llamada a next() - CRÍTICO
    console.log('=== AUTH MIDDLEWARE COMPLETED SUCCESSFULLY ===');
    next();

  } catch (error) {
    // 🔴 BREAKPOINT 10: Manejo de errores
    console.log('=== AUTH MIDDLEWARE ERROR ===');
    console.log('Error details:', error);
    console.log('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.log('Error stack:', error instanceof Error ? error.stack : 'No stack');
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
