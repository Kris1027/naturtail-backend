import { User, CreateUserDTO, UpdateUserDTO, UserRole } from '../types/user.types';
import { generateIdSync } from '../utils/idGenerator';

class UserRepository {
  private users: User[] = [];

  findAll(): User[] {
    return [...this.users];
  }

  findById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  findByRole(role: UserRole): User[] {
    return this.users.filter(u => u.role === role);
  }

  findActive(): User[] {
    return this.users.filter(u => u.isActive);
  }

  create(data: CreateUserDTO): User {
    const newUser: User = {
      id: generateIdSync('user'),
      ...data,
      role: data.role || UserRole.USER,
      isActive: true,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  update(id: string, data: UpdateUserDTO): User | null {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return null;
    }

    const updatedUser = {
      ...this.users[index],
      ...data,
      updatedAt: new Date(),
    };

    this.users[index] = updatedUser;
    return updatedUser;
  }

  delete(id: string): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return false;
    }

    this.users.splice(index, 1);
    return true;
  }

  clear(): void {
    this.users = [];
  }
}

export const userRepository = new UserRepository();