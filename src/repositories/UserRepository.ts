import { User, CreateUserDTO, UpdateUserDTO, UserResponse } from '../models/User';

export interface IUserRepository {
  create(userData: CreateUserDTO & { password: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, userData: UpdateUserDTO): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

// Mock implementation for testing
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

  // Helper method for testing
  getAllUsers(): User[] {
    return [...this.users];
  }

  clearAll(): void {
    this.users = [];
  }
}
