import express, { Request as ExpressRequest, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Blog from '../models/blog';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error('JWT secret is not defined in environment variables');
  process.exit(1);
}

interface Request extends ExpressRequest {
  userId?: string;
}

const authRouter = express.Router();

// Middleware to verify JWT token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.userId = (decoded as { userId: string }).userId;
    next();
  });
};

authRouter.post('/users/signup', async (req, res) => {
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

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!);

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Error signing up. Please try again later.' });
  }
});

authRouter.post('/users/login', async (req, res) => {
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in. Please try again later.' });
  }
});

// Protected route to add blog (requires valid JWT token)
authRouter.post('/api/addblog', verifyToken, async (req, res) => {
  try {
    const { title, photo, content } = req.body;

    // Create a new blog post
    const newBlogPost = await Blog.create({
      title,
      photo,
      content,
      author: req.userId
    });

    res.status(201).json({ message: 'Blog post added successfully', blogPost: newBlogPost });
  } catch (error) {
    console.error('Error adding blog post:', error);
    res.status(500).json({ message: 'Error adding blog post. Please try again later.' });
  }
});

export default authRouter;
