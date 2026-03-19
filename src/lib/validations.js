import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']).optional(), // Allows setting initial role for testing
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const createSignalSchema = z.object({
  title: z.string().min(3).max(100),
  symbol: z.string().min(1).max(20),
  type: z.enum(['BUY', 'SELL']),
  confidence: z.number().min(0).max(100),
});

export const updateSignalSchema = z.object({
  status: z.enum(['approved', 'rejected']),
});
