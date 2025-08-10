import { Request, Response } from 'express';
import { JwtService } from '../services/JwtService';

export const debugController = {
  testToken: (req: Request, res: Response) => {
    try {
      console.log('=== DEBUG TOKEN TEST ===');

      const authHeader = req.headers.authorization;
      console.log('Auth Header:', authHeader);

      if (!authHeader) {
        return res.status(400).json({ error: 'No Authorization header' });
      }

      if (!authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ error: 'Invalid Authorization format' });
      }

      const token = authHeader.substring(7);
      console.log('Token extracted:', token.substring(0, 50) + '...');

      const jwtService = new JwtService();

      try {
        const payload = jwtService.verifyToken(token);
        console.log('Token payload:', payload);

        res.json({
          success: true,
          message: 'Token is valid',
          payload: payload
        });
      } catch (error) {
        console.log('Token verification error:', error);
        res.status(401).json({
          success: false,
          message: 'Token verification failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    } catch (error) {
      console.log('Debug controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};
