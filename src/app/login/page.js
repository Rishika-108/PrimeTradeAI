"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleChange = (e) => {
    // Dynamically update payload targeting ID fields natively bound heavily
    setFormData({ ...formData, [e.target.id]: e.target.value });
    
    // Clear the specific error validation immediately actively providing feedback
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
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          // Flatten zod mapped nested structures mapping to exact target fields dynamically
          const formattedErrors = {};
          if (data.errors.username) formattedErrors.username = data.errors.username._errors[0];
          if (data.errors.password) formattedErrors.password = data.errors.password._errors[0];
          setErrors(formattedErrors);
        } else {
          setApiError(data.message || 'Login failed');
        }
        setIsLoading(false);
        return;
      }

      // Triggers client AuthContext persistence logic automatically bootstrapping redirection
      login(data.token, data.user);
    } catch (err) {
      setApiError('An unexpected server error occurred. Please verify backend status.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center pt-16">
      <Card className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Welcome Back</h1>
          <p className="text-sm font-medium tracking-wide text-text-secondary">Enter your credentials to manage signals</p>
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
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full mt-6 py-2.5 text-base shadow"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-text-secondary tracking-wide">
          Don't have an account?{' '}
          <Link href="/register" className="text-accent-buy hover:underline font-bold ml-1 transition-all">
            Register here
          </Link>
        </div>
      </Card>
    </div>
  );
}
