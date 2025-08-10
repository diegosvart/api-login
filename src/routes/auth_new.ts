import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { registerSchema, loginSchema, updateProfileSchema } from '../validation/userValidation';

const router = Router();
const authController = new AuthController();

// Rutas públicas
router.post('/register', 
  validateRequest(registerSchema), 
  authController.register
);

router.post('/login', 
  validateRequest(loginSchema), 
  authController.login
);

// Rutas protegidas (requieren autenticación)
router.get('/profile', 
  authMiddleware, 
  authController.profile
);

router.put('/profile', 
  authMiddleware,
  validateRequest(updateProfileSchema), 
  authController.updateProfile
);

router.post('/logout', 
  authMiddleware, 
  authController.logout
);

export default router;
