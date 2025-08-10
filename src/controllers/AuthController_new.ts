import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { JwtService } from '../services/JwtService';
import { CreateUserDTO } from '../models/User';

export class AuthController {
  private authService: AuthService;
  private jwtService: JwtService;

  constructor() {
    this.authService = new AuthService();
    this.jwtService = new JwtService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, email, password, firstName, lastName } = req.body;

      const userData: CreateUserDTO = {
        username,
        email, 
        password,
        firstName,
        lastName
      };

      const result = await this.authService.register(userData);

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.message
        });
        return;
      }

      // Generate JWT token
      if (result.user) {
        const token = this.jwtService.generateToken({
          userId: result.user.id,
          email: result.user.email
        });

        res.status(201).json({
          success: true,
          message: result.message,
          data: {
            user: result.user,
            token
          }
        });
      }

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login(email, password);

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.message
        });
        return;
      }

      // Generate JWT token
      if (result.user) {
        const token = this.jwtService.generateToken({
          userId: result.user.id,
          email: result.user.email
        });

        res.status(200).json({
          success: true,
          message: result.message,
          data: {
            user: result.user,
            token
          }
        });
      }

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  profile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
        return;
      }

      const userProfile = await this.authService.getUserProfile(userId);

      if (!userProfile) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Perfil obtenido exitosamente',
        data: {
          user: userProfile
        }
      });

    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { firstName, lastName, email } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
        return;
      }

      const updatedProfile = await this.authService.updateProfile(userId, {
        firstName,
        lastName,
        email
      });

      if (!updatedProfile) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: {
          user: updatedProfile
        }
      });

    } catch (error) {
      console.error('Error actualizando perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // In a stateless JWT system, logout is handled client-side by removing the token
      // In a more sophisticated system, you might want to blacklist the token
      
      res.status(200).json({
        success: true,
        message: 'Logout exitoso'
      });

    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
}
