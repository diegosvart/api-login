import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth';

export class JwtService {
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
  }

  generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: '24h'
    });
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
