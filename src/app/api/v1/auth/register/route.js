import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { registerSchema } from '@/lib/validations';

export async function POST(req) {
  try {
    const body = await req.json();
    const validation = registerSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ 
        message: 'Validation failed', 
        errors: validation.error.format() 
      }, { status: 400 });
    }
    
    await connectToDatabase();
    
    const { username, password, role } = validation.data;
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      return NextResponse.json({ message: 'Username already exists' }, { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: role || 'user',
    });
    
    return NextResponse.json({ 
      message: 'User registered successfully', 
      user: {
        _id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        createdAt: newUser.createdAt
      } 
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
