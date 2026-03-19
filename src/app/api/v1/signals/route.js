import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Signal from '@/models/Signal';
import { createSignalSchema } from '@/lib/validations';
import { authMiddleware, handleAuthError } from '@/lib/auth';
import { getCachedSignals, setCachedSignals, invalidateCache } from '@/lib/redis';

// GET all signals - Rebuilt with Redis Configuration
export async function GET(req) {
  try {
    const { user, error, status } = await authMiddleware(req);
    if (error) return handleAuthError(error, status);
    
    let query = {};
    const { searchParams } = new URL(req.url);
    const filterStatus = searchParams.get('status');
    
    // Construct exact unique Redis key for High Performance scoping
    const cacheKey = filterStatus 
      ? `signals:${user.role === 'admin' ? 'admin' : user._id}:status:${filterStatus}`
      : `signals:${user.role === 'admin' ? 'admin' : user._id}`;
      
    // INTERCEPT CACHE
    const cachedData = await getCachedSignals(cacheKey);
    if (cachedData) {
      // Header marking X-Cache hits cleanly returning instant payload
      return NextResponse.json({ signals: cachedData }, { status: 200, headers: { 'X-Cache': 'HIT' } });
    }
    
    // DB Fallback Loop
    await connectToDatabase();
    
    if (filterStatus) {
      query.status = filterStatus;
    }
    if (user.role !== 'admin') {
      query.userId = user._id;
    }
    
    const signals = await Signal.find(query).sort({ createdAt: -1 }).populate('userId', 'username role'); 
      
    // Write fresh payload onto Redis targeting 60 secs lifetime locally explicitly
    await setCachedSignals(cacheKey, signals, 60);
      
    return NextResponse.json({ signals }, { status: 200, headers: { 'X-Cache': 'MISS' } });
  } catch (error) {
    console.error('Fetch signals error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST new signal
export async function POST(req) {
  try {
    const { user, error, status } = await authMiddleware(req);
    if (error) return handleAuthError(error, status);
    
    const body = await req.json();
    const validation = createSignalSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ message: 'Validation failed', errors: validation.error.format() }, { status: 400 });
    }
    
    await connectToDatabase();
    
    const newSignal = await Signal.create({
      ...validation.data,
      userId: user._id,
      status: 'pending',
    });
    
    // Hard INVALIDATE CACHES - Re-syncing the nodes globally for Admin clusters & specific Target Users instantly
    await invalidateCache([`signals:${user._id}`, 'signals:admin']);
    
    return NextResponse.json({ message: 'Signal created successfully', signal: newSignal }, { status: 201 });
  } catch (error) {
    console.error('Create signal error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
