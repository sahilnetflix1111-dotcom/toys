'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { getCartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load and apply theme on mount (prevents SSR hydration mismatch)
  useEffect(() => {
    // Anti-theft: prevent right-click globally
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    const savedTheme = localStorage.getItem('feel_the_wellness_theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('feel_the_wellness_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        <Link href="/" className="logo">
          FeelThe<span className="logo-accent">Wellness</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          {/* Links removed as requested */}
        </nav>

        <div className="header-actions">
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          <Link href="/cart" className="cart-btn" aria-label="Shopping Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>

          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <Link href="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/catalog?category=Women%20Sex%20Toys&subcategory=Vibrators%20%26%20Wands" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Vibrators & Wands</Link>
            <Link href="/catalog?category=Women%20Sex%20Toys&subcategory=Dildos" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Dildos & Realistic</Link>
            <Link href="/catalog?category=Men%20Sex%20Toys" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Male Pleasure</Link>
            <Link href="/catalog?category=Couples%20Toys" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Couple's Play</Link>
            <Link href="/catalog?category=BDSM%20%26%20Bondage" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>BDSM & Bondage</Link>
            <Link href="/catalog?category=Lingerie%20%26%20Clothing" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Lingerie & Wellness</Link>
            <Link href="/cart" className="mobile-nav-link cart-link" onClick={() => setMobileMenuOpen(false)}>
              Cart ({getCartCount()})
            </Link>
          </nav>
        </div>
      )}

      {/* CSS Styles for Header */}
      <style jsx global>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--bg-header, rgba(10, 5, 13, 0.85));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          transition: var(--transition-fast);
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }

        .logo {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 400;
          color: var(--text-primary);
          letter-spacing: 0.05em;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.15);
        }
        @media (min-width: 768px) {
          .logo { font-size: 1.8rem; }
        }

        .logo-accent {
          color: var(--accent);
          font-weight: 300;
          font-style: italic;
        }

        .desktop-nav {
          display: none;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
          }
        }

        .nav-link {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          position: relative;
          padding: 8px 0;
        }

        .nav-link:hover {
          color: var(--accent);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1.5px;
          background-color: var(--accent);
          transition: var(--transition-fast);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cart-btn {
          position: relative;
          color: var(--text-secondary);
          padding: 12px;
          border-radius: 50%;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 44px;
          min-height: 44px;
        }

        .cart-btn:hover {
          color: var(--accent);
          background: rgba(255, 255, 255, 0.03);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.1);
        }

        .theme-toggle-btn {
          color: var(--text-secondary);
          padding: 12px;
          border-radius: 50%;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          min-width: 44px;
          min-height: 44px;
        }

        .theme-toggle-btn:hover {
          color: var(--accent);
          background: var(--border-light);
          box-shadow: 0 0 10px rgba(255, 42, 133, 0.15);
        }

        .cart-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: var(--accent-secondary);
          color: var(--bg-primary);
          font-size: 0.7rem;
          font-weight: 700;
          border-radius: 50%;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 1.5px solid var(--bg-primary);
        }

        .mobile-menu-toggle {
          color: var(--text-primary);
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
          min-width: 44px;
          min-height: 44px;
        }

        @media (min-width: 768px) {
          .mobile-menu-toggle {
            display: none;
          }
        }

        .mobile-menu {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--bg-mobile-menu, rgba(10, 5, 13, 0.98));
          z-index: 99;
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: scaleY(0.95) translateY(-10px); }
          to { opacity: 1; transform: scaleY(1) translateY(0); }
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          padding: 40px 24px;
          gap: 24px;
        }

        .mobile-nav-link {
          font-size: 1.2rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .mobile-nav-link:hover, .mobile-nav-link.cart-link {
          color: var(--accent);
          border-bottom-color: var(--accent);
        }
      `}</style>
    </header>
  );
}
