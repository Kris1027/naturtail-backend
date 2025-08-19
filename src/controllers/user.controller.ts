import { Request, Response } from 'express';
import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO,
  UserRole,
} from '../types/user.types';
import { validateEmail } from '../middleware/validation.middleware';
import { generateId } from '../utils/idGenerator';

const users: User[] = [];

const excludePassword = (user: User): UserResponseDTO => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const createUser = async (req: Request<{}, {}, CreateUserDTO>, res: Response) => {
  try {
    const { email, password, firstName, lastName, role, phone, address } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        requiredFields: ['email', 'password', 'firstName', 'lastName'],
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long',
      });
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    const newUser: User = {
      id: generateId('user'),
      email,
      password,
      firstName,
      lastName,
      role: role || UserRole.USER,
      phone,
      address,
      isActive: true,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);

    return res.status(201).json({
      success: true,
      data: excludePassword(newUser),
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const usersWithoutPasswords = users.map(excludePassword);

    return res.status(200).json({
      success: true,
      data: usersWithoutPasswords,
      total: users.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const getUserById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: excludePassword(user),
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const getUsersByRole = async (req: Request<{ role: string }>, res: Response) => {
  try {
    const { role } = req.params;

    if (!Object.values(UserRole).includes(role as UserRole)) {
      return res.status(400).json({
        error: 'Invalid role. Must be either "admin" or "user"',
      });
    }

    const filteredUsers = users.filter((u) => u.role === role);
    const usersWithoutPasswords = filteredUsers.map(excludePassword);

    return res.status(200).json({
      success: true,
      data: usersWithoutPasswords,
      total: filteredUsers.length,
    });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const updateUser = async (
  req: Request<{ id: string }, {}, UpdateUserDTO>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    if (updates.email && updates.email !== users[userIndex].email) {
      const emailExists = users.some((u) => u.email === updates.email && u.id !== id);
      if (emailExists) {
        return res.status(409).json({
          error: 'Email already in use',
        });
      }
    }

    const updatedUser: User = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date(),
    };

    users[userIndex] = updatedUser;

    return res.status(200).json({
      success: true,
      data: excludePassword(updatedUser),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: excludePassword(deletedUser),
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};