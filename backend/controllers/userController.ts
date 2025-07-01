import { Request, Response } from 'express';
import * as UserModel from '../models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

import validator from 'validator'; 

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Basic empty field check
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  // Email format validation
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // if (!emailRegex.test(email)) {
  //   res.status(400).json({ error: 'Invalid email format.' });
  //   return;
  // }

  // OR use a robust validator library (optional)
  if (!validator.isEmail(email)) {
    res.status(400).json({ error: 'Invalid email address.' });
    return;
  }

  // Password strength (optional but good practice)
  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    return;
  }

  try {
    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'User already exists.' });
      return;
    }

    await UserModel.createUser(email, password);
    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed. Please try again later.' });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.getUserByEmail(email);
    
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }



    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login error' });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await UserModel.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Don't send password in response
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user profile' });
  }
}

  // get user by email
  export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
    const email = (req as any).user.email;
    console.log('Getting user by email:', email);
    try {
      
      const user = await UserModel.getUserByEmail(email);
  
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      // Exclude password
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving user by email' });
    }
  };
  
