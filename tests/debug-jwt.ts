import { JwtService } from './src/services/JwtService';

console.log('=== TESTING JWT SERVICE ===');

const jwtService = new JwtService();

// Test token generation
const payload = {
  userId: 'test-user-123',
  email: 'test@example.com'
};

console.log('1. Generating token...');
const token = jwtService.generateToken(payload);
console.log('Generated token:', token.substring(0, 50) + '...');

console.log('2. Verifying token...');
try {
  const decoded = jwtService.verifyToken(token);
  console.log('Decoded payload:', decoded);
  console.log('Token verification successful!');
} catch (error) {
  console.error('Token verification failed:', error);
}
