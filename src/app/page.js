"use client";

import { useEffect, useState, useCallback } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import SignalForm from '@/components/SignalForm';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI Interactive States
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSignals = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/v1/signals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch signals map');
      
      setSignals(data.signals || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  const handleCreateSignal = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/signals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Creation rejected locally');
      
      // Update state locally unshifting it to the top exactly preventing extra network loops
      setSignals([data.signal, ...signals]);
      setShowForm(false);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`/api/v1/signals/${id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setSignals(signals.map(s => s._id === id ? { ...s, status } : s));
      } else {
         alert("Action restricted mapping rejected");
      }
    } catch (err) {
      alert('Status update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you permanently sure you want to delete this signal block?')) return;
    try {
      const res = await fetch(`/api/v1/signals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSignals(signals.filter(s => s._id !== id));
      } else {
        alert("Deletion restricted");
      }
    } catch (err) {
      alert('Delete runtime failed');
    }
  };

  if (error) {
    return (
      <ProtectedRoute>
        <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 font-medium">
          Dashboard Diagnostics Error: {error}
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="w-full flex flex-col gap-8">
        {/* Core Control Layer Header */}
        <div className="flex justify-between items-center bg-brand-bg pb-2 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Signal Dashboard</h1>
            <p className="text-text-secondary text-sm mt-1">
              {user?.role === 'admin' 
                ? 'System Moderation Node: Verifying pending global algorithmic data.' 
                : 'Trading Desk: Generate & track your custom AI predictors.'}
            </p>
          </div>
          {user?.role !== 'admin' && !showForm && (
            <Button variant="buy" onClick={() => setShowForm(true)} className="uppercase text-xs font-bold px-5">
               Generate Intel
            </Button>
          )}
        </div>

        {/* Dynamic Creation Form */}
        {showForm && (
          <SignalForm 
            onSubmit={handleCreateSignal} 
            onCancel={() => setShowForm(false)} 
            isLoading={isSubmitting} 
          />
        )}

        {/* Data Architecture Core Content Routing */}
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-t-accent-buy border-gray-700 animate-spin"></div>
          </div>
        ) : signals.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed border-gray-700 bg-transparent shadow-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-secondary mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-xl font-bold text-text-primary">No Active Algorithms Found</h3>
            <p className="text-text-secondary mt-2 text-sm max-w-sm leading-relaxed">
              {user?.role === 'admin' 
                ? 'All quiet on the network. There are currently no signals waiting in the entire system cluster.' 
                : 'You haven\'t mapped any trading signals to the algorithm engine yet. Begin feeding instructions!'}
            </p>
            {user?.role !== 'admin' && !showForm && (
              <Button variant="primary" className="mt-8 px-8 py-3 uppercase text-xs font-bold" onClick={() => setShowForm(true)}>
                Engage First Array
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-16">
            {signals.map((signal) => (
              <Card key={signal._id} className="flex flex-col justify-between h-full hover:border-gray-500 transition-colors bg-[#1A1A1A]">
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant={signal.type === 'BUY' ? 'buy' : 'sell'} className="font-extrabold px-3 shadow-sm text-xs uppercase tracking-wider">
                      {signal.type} {signal.symbol}
                    </Badge>
                    <Badge variant={
                      signal.status === 'approved' ? 'success' : 
                      signal.status === 'rejected' ? 'danger' : 'warning'
                    } className="uppercase text-[10px] tracking-wider px-2">
                      {signal.status}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-text-primary mb-2 line-clamp-2 leading-snug">{signal.title}</h3>
                  <div className="flex flex-col gap-2 mt-auto bg-black/40 p-3 rounded-lg border border-gray-800">
                    <div className="flex justify-between items-center w-full">
                       <span className="text-xs font-semibold text-text-secondary tracking-wide">Confidence</span>
                       <span className={`text-xs font-bold ${signal.confidence >= 75 ? 'text-green-500' : signal.confidence >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>{signal.confidence}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full transition-all duration-500 ${signal.confidence >= 75 ? 'bg-green-500' : signal.confidence >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                        style={{ width: `${signal.confidence}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary uppercase mt-4 font-medium border-t border-gray-800 pt-3">
                    {user?.role === 'admin' && <span className="text-gray-400">Node: {signal.userId?.username || 'GHOST'} • </span>}
                    {new Date(signal.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-800 flex gap-3">
                  {user?.role === 'admin' ? (
                    <>
                      {signal.status !== 'approved' && (
                        <Button 
                          variant="ghost" 
                          className="flex-1 text-sm text-accent-buy hover:text-accent-buy hover:bg-accent-buy/10 py-2"
                          onClick={() => handleStatusChange(signal._id, 'approved')}
                        >
                          Approve
                        </Button>
                      )}
                      {signal.status !== 'rejected' && (
                        <Button 
                          variant="ghost" 
                          className="flex-1 text-sm text-accent-sell hover:text-accent-sell hover:bg-accent-sell/10 py-2"
                          onClick={() => handleStatusChange(signal._id, 'rejected')}
                        >
                          Reject
                        </Button>
                      )}
                      <Button variant="ghost" className="px-3 py-2" onClick={() => handleDelete(signal._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary hover:text-red-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="ghost" 
                      className="w-full text-xs text-red-500/90 hover:text-red-500 hover:bg-red-500/10 py-2 uppercase font-bold tracking-widest"
                      onClick={() => handleDelete(signal._id)}
                    >
                      Delete Signal
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}