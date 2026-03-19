"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SignalForm({ onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({ title: '', symbol: '', type: 'BUY', confidence: 50 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'confidence' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="p-6 border border-gray-700 bg-[#1E1E1E] shadow-2xl relative z-10 w-full mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold tracking-tight">Create AI Signal Indicator</h2>
        <Button variant="ghost" onClick={onCancel} className="px-3 py-1" disabled={isLoading}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input 
          id="title"
          name="title"
          label="Signal Title"
          placeholder="e.g. RSI divergence breakout on 4H chart"
          value={formData.title}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        
        <div className="flex gap-4">
          <div className="w-1/2">
            <Input 
              id="symbol"
              name="symbol"
              label="Symbol Pair"
              placeholder="BTC/USD"
              value={formData.symbol}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="flex flex-col gap-1.5 w-1/2">
            <label htmlFor="type" className="text-sm font-medium text-text-secondary">Action Direction</label>
            <select 
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-buy shadow-sm appearance-none cursor-pointer tracking-wide font-medium"
            >
              <option value="BUY">📈 BUY (Long)</option>
              <option value="SELL">📉 SELL (Short)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full pt-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-text-secondary">Fake AI Confidence Level Overlay</label>
            <span className={`text-sm font-bold ${formData.confidence > 70 ? 'text-accent-buy' : formData.confidence < 40 ? 'text-accent-sell' : 'text-yellow-500'}`}>
              {formData.confidence}%
            </span>
          </div>
          <input 
            type="range"
            name="confidence"
            min="0"
            max="100"
            value={formData.confidence}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <Button 
          type="submit" 
          variant={formData.type === 'BUY' ? 'buy' : 'sell'} 
          className="w-full mt-6 py-3 font-bold uppercase tracking-wide"
          disabled={isLoading}
        >
          {isLoading ? 'Running Algorithms...' : `Generate ${formData.type} Signal`}
        </Button>
      </form>
    </Card>
  );
}
