'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { authenticate } from '../actions/auth';

export default function LoginPage() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await authenticate(passcode);
      if (result.success) {
        router.push('/admin');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex-center" style={{ minHeight: '60vh', padding: '20px' }}>
        <div className="admin-gate-card" style={{ maxWidth: '400px', width: '100%', padding: '32px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div className="gate-icon" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '16px' }}>🔒</div>
          <h1 className="glow-text" style={{ textAlign: 'center', marginBottom: '16px' }}>Secure Admin Access</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px' }}>Enter the administrator passcode to access the dashboard.</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && <div className="error-msg" style={{ color: '#ff4d4d', textAlign: 'center', background: 'rgba(255, 77, 77, 0.1)', padding: '12px', borderRadius: '6px' }}>{error}</div>}
            
            <div className="form-group">
              <label className="form-label" htmlFor="passcode">Admin Passcode</label>
              <input 
                type="password" 
                id="passcode" 
                className="form-input" 
                placeholder="Enter passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
