import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import Signal from '@/models/Signal';
import { updateSignalSchema } from '@/lib/validations';
import { authMiddleware, roleMiddleware, handleAuthError } from '@/lib/auth';
import { invalidateCache } from '@/lib/redis';

// PATCH
export async function PATCH(req, { params }) {
  try {
    const { user, error, status } = await authMiddleware(req);
    if (error) return handleAuthError(error, status);
    
    // Explicitly restrict to admins
    const roleCheck = roleMiddleware(user, 'admin');
    if (roleCheck.error) return handleAuthError(roleCheck.error, roleCheck.status);
    
    const { id } = await Promise.resolve(params);
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: 'Invalid signal ID' }, { status: 400 });
    
    const body = await req.json();
    const validation = updateSignalSchema.safeParse(body);
    
    if (!validation.success) return NextResponse.json({ message: 'Validation failed', errors: validation.error.format() }, { status: 400 });
    
    await connectToDatabase();
    
    const updatedSignal = await Signal.findByIdAndUpdate(
      id,
      { status: validation.data.status },
      { new: true, runValidators: true }
    ).populate('userId', 'username');
    
    if (!updatedSignal) return NextResponse.json({ message: 'Signal not found' }, { status: 404 });
    
    // REDIS CACHE INVALIDATION
    await invalidateCache([`signals:${updatedSignal.userId._id}`, 'signals:admin']);
    
    return NextResponse.json({ message: `Signal marked as ${validation.data.status}`, signal: updatedSignal }, { status: 200 });
  } catch (error) {
    console.error('Update signal error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req, { params }) {
  try {
    const { user, error, status } = await authMiddleware(req);
    if (error) return handleAuthError(error, status);
    
    const { id } = await Promise.resolve(params);
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: 'Invalid signal ID' }, { status: 400 });
    
    await connectToDatabase();
    const signal = await Signal.findById(id);
    
    if (!signal) return NextResponse.json({ message: 'Signal not found' }, { status: 404 });
    
    if (user.role !== 'admin' && signal.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Forbidden: Cannot delete this signal' }, { status: 403 });
    }
    
    await Signal.findByIdAndDelete(id);
    
    // REDIS CACHE INVALIDATION
    await invalidateCache([`signals:${signal.userId}`, 'signals:admin']);
    
    return NextResponse.json({ message: 'Signal deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete signal error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
