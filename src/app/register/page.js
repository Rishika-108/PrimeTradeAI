"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError('');
    setErrors({});

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const formattedErrors = {};
          if (data.errors.username) formattedErrors.username = data.errors.username._errors[0];
          if (data.errors.password) formattedErrors.password = data.errors.password._errors[0];
          setErrors(formattedErrors);
        } else {
          setApiError(data.message || 'Registration failed');
        }
        setIsLoading(false);
        return;
      }

      // Graceful completion mapping to active sign in layer
      router.push('/login');
    } catch (err) {
      setApiError('An unexpected network error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center pt-16">
      <Card className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Join the Platform</h1>
          <p className="text-sm font-medium tracking-wide text-text-secondary">Register a fresh account into PrimeTrade AI</p>
        </div>

        {apiError && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/50 rounded-lg text-sm text-red-500 shadow-sm text-center">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            id="username"
            label="Username"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            disabled={isLoading}
          />
          <Input 
            id="password"
            label="Password"
            type="password"
            placeholder="Min. 6 alphanumeric characters"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
          />
          
          <div className="flex flex-col gap-1.5 w-full pt-1">
            <label htmlFor="role" className="text-sm font-medium text-text-secondary">Test Authorization Role Profile</label>
            <select 
              id="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-buy transition-colors cursor-pointer appearance-none"
            >
              <option value="user">Standard Trader Profile</option>
              <option value="admin">Administrator Overlay</option>
            </select>
          </div>

          <Button 
            type="submit" 
            variant="buy" 
            className="w-full mt-6 py-2.5 text-base shadow"
            disabled={isLoading}
          >
            {isLoading ? 'Awaiting Allocation...' : 'Complete Registry'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-text-secondary tracking-wide">
          Already verified access profile?{' '}
          <Link href="/login" className="text-accent-buy hover:underline font-bold ml-1 transition-all">
            Enter now
          </Link>
        </div>
      </Card>
    </div>
  );
}
