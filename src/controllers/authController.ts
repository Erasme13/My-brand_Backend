import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error('JWT secret is not defined in environment variables');
  process.exit(1); 
}

// User Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: newUser._id }, jwtSecret);

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Error signing up. Please try again later.' });
  }
};

// User Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in. Please try again later.' });
  }
};
