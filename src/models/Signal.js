import mongoose from 'mongoose';

const SignalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the signal'],
      trim: true,
    },
    symbol: {
      type: String,
      required: [true, 'Please provide a trading symbol (e.g., BTC/USD)'],
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      required: [true, 'Please provide a signal type (BUY or SELL)'],
      enum: ['BUY', 'SELL'],
    },
    confidence: {
      type: Number,
      required: [true, 'Please provide a confidence level'],
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide an associated userId'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Signal || mongoose.model('Signal', SignalSchema);
