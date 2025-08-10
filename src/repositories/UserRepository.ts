import { User, CreateUserDTO, UpdateUserDTO, UserResponse } from '../models/User';
import { query, getClient } from '../config/database';
import { PoolClient } from 'pg';

export interface IUserRepository {
  create(userData: CreateUserDTO & { password: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, userData: UpdateUserDTO): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  updateLastLogin(id: string): Promise<void>;
}

// PostgreSQL implementation
export class PostgreSQLUserRepository implements IUserRepository {

  async create(userData: CreateUserDTO & { password: string }): Promise<User> {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO users (email, password, first_name, last_name, username)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, first_name, last_name, username, is_active, created_at, updated_at, last_login`,
        [userData.email, userData.password, userData.firstName, userData.lastName, userData.username]
      );

      await client.query('COMMIT');

      const dbUser = result.rows[0];
      return {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        password: userData.password, // No retornamos la password en producción
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        isActive: dbUser.is_active,
        createdAt: dbUser.created_at,
        updatedAt: dbUser.updated_at,
        lastLogin: dbUser.last_login
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await query(
        `SELECT id, email, password, first_name, last_name, username, is_active, 
                created_at, updated_at, last_login 
         FROM users 
         WHERE email = $1 AND is_active = true`,
        [email]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const dbUser = result.rows[0];
      return {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        password: dbUser.password,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        isActive: dbUser.is_active,
        createdAt: dbUser.created_at,
        updatedAt: dbUser.updated_at,
        lastLogin: dbUser.last_login
      };
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await query(
        `SELECT id, email, password, first_name, last_name, username, is_active,
                created_at, updated_at, last_login
         FROM users 
         WHERE username = $1 AND is_active = true`,
        [username]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const dbUser = result.rows[0];
      return {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        password: dbUser.password,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        isActive: dbUser.is_active,
        createdAt: dbUser.created_at,
        updatedAt: dbUser.updated_at,
        lastLogin: dbUser.last_login
      };
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const result = await query(
        `SELECT id, email, password, first_name, last_name, username, is_active,
                created_at, updated_at, last_login
         FROM users 
         WHERE id = $1 AND is_active = true`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const dbUser = result.rows[0];
      return {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        password: dbUser.password,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        isActive: dbUser.is_active,
        createdAt: dbUser.created_at,
        updatedAt: dbUser.updated_at,
        lastLogin: dbUser.last_login
      };
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  async update(id: string, userData: UpdateUserDTO): Promise<User | null> {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Construir query dinámicamente basado en campos presentes
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (userData.firstName) {
        updateFields.push(`first_name = $${paramCount++}`);
        values.push(userData.firstName);
      }
      if (userData.lastName) {
        updateFields.push(`last_name = $${paramCount++}`);
        values.push(userData.lastName);
      }
      if (userData.username) {
        updateFields.push(`username = $${paramCount++}`);
        values.push(userData.username);
      }
      if (userData.email) {
        updateFields.push(`email = $${paramCount++}`);
        values.push(userData.email);
      }

      if (updateFields.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      // Agregar updated_at automático
      updateFields.push(`updated_at = NOW()`);
      values.push(id);

      const result = await client.query(
        `UPDATE users 
         SET ${updateFields.join(', ')} 
         WHERE id = $${paramCount} AND is_active = true
         RETURNING id, email, first_name, last_name, username, is_active, 
                  created_at, updated_at, last_login`,
        values
      );

      await client.query('COMMIT');

      if (result.rows.length === 0) {
        return null;
      }

      const dbUser = result.rows[0];
      return {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        password: '', // No retornar password
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        isActive: dbUser.is_active,
        createdAt: dbUser.created_at,
        updatedAt: dbUser.updated_at,
        lastLogin: dbUser.last_login
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Soft delete - marcar como inactivo
      const result = await query(
        `UPDATE users 
         SET is_active = false, updated_at = NOW() 
         WHERE id = $1 AND is_active = true`,
        [id]
      );

      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      await query(
        `UPDATE users 
         SET last_login = NOW(), updated_at = NOW() 
         WHERE id = $1`,
        [id]
      );
    } catch (error) {
      console.error('Error updating last login:', error);
      // No throw - es un error no crítico
    }
  }
}

// Mock implementation for testing (mantener para tests)
export class MockUserRepository implements IUserRepository {
  private users: User[] = [];

  async create(userData: CreateUserDTO & { password: string }): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.users.find(user => user.username === username) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async update(id: string, userData: UpdateUserDTO): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return null;
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date()
    };

    return this.users[userIndex];
  }

  async delete(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }

  async updateLastLogin(id: string): Promise<void> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex].lastLogin = new Date();
      this.users[userIndex].updatedAt = new Date();
    }
  }

  // Helper methods for testing
  getAllUsers(): User[] {
    return [...this.users];
  }

  clearAll(): void {
    this.users = [];
  }
}
