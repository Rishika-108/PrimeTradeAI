import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectToDatabase from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * Validates the Authorization header and attaches the user model if valid.
 * Returns { user, error, status }
 */
export async function authMiddleware(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Unauthorized: No token provided', status: 401 };
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return { error: 'Unauthorized: No token provided', status: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return { error: 'Unauthorized: Invalid token', status: 401 };
    }

    await connectToDatabase();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return { error: 'Unauthorized: User not found', status: 401 };
    }

    return { user, error: null };
  } catch (error) {
    return { error: 'Unauthorized: Invalid or expired token', status: 401 };
  }
}

/**
 * Checks if a verified user has a specific role.
 */
export function roleMiddleware(user, requiredRole) {
  if (user.role !== requiredRole) {
    return { error: `Forbidden: Requires ${requiredRole} role`, status: 403 };
  }
  return { error: null };
}

/**
 * Quick helper to return Next.js JSON error responses
 */
export function handleAuthError(error, status) {
  return NextResponse.json({ message: error }, { status });
}
