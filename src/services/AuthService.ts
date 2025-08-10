import bcrypt from 'bcryptjs';
import { User, CreateUserDTO, UpdateUserDTO, UserResponse } from '../models/User';
import { IUserRepository, PostgreSQLUserRepository } from '../repositories/UserRepository';

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: UserResponse;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: UserResponse;
}

export class AuthService {
  private userRepository: IUserRepository;
  private readonly saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');

  constructor(userRepository?: IUserRepository) {
    // Use PostgreSQL repository by default, allow override for testing
    this.userRepository = userRepository || new PostgreSQLUserRepository();
  }

  async register(userData: CreateUserDTO): Promise<RegisterResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'Usuario ya existe con este email'
        };
      }

      const existingUsername = await this.userRepository.findByUsername(userData.username);
      if (existingUsername) {
        return {
          success: false,
          message: 'Usuario ya existe con este nombre de usuario'
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);

      // Create user
      const newUser = await this.userRepository.create({
        ...userData,
        password: hashedPassword
      });

      // Return user without password
      const userResponse: UserResponse = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      };

      return {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: userResponse
      };

    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'Credenciales inválidas'
        };
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          message: 'Cuenta desactivada'
        };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Credenciales inválidas'
        };
      }

      // Update last login timestamp
      try {
        await this.userRepository.updateLastLogin(user.id);
      } catch (error) {
        console.warn('Warning: Could not update last login:', error);
        // Continue with login process even if this fails
      }

      // Return user without password
      const userResponse: UserResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin
      };

      return {
        success: true,
        message: 'Login exitoso',
        user: userResponse
      };

    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  async getUserProfile(userId: string): Promise<UserResponse | null> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updateData: UpdateUserDTO): Promise<UserResponse | null> {
    try {
      const updatedUser = await this.userRepository.update(userId, updateData);
      if (!updatedUser) {
        return null;
      }

      return {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      };

    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return null;
    }
  }
}
