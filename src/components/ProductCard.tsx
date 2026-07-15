'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

// Map products to realistic brand labels based on id/category
export const getProductBrand = (id: number, category: string) => {
  const brands = ['SATISFYER', 'FEELTHEWELLNESS', 'FIFTY SHADES OF GREY', 'ROCKS OFF', 'LELO', 'SANGYA'];
  if (category === 'Vibrators & Wands') return brands[id % 2 === 0 ? 0 : 4];
  if (category === 'Dildos & Realistic') return brands[1];
  if (category === 'Male Pleasure') return brands[id % 2 === 0 ? 3 : 1];
  if (category === "Couple's Play") return brands[4];
  if (category === 'BDSM & Bondage') return brands[2];
  return brands[id % brands.length];
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i - rating < 1) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    return stars;
  };

  const imageUrl = product.images[0];
  const brandName = getProductBrand(product.id, product.category);
  
  // Calculate dynamic monthly EMI (approx price / 4)
  const emiPrice = Math.round(product.price / 4);

  // Original crossed out price calculation
  const originalPrice = Math.round(product.price / (1 - (product.discountPercent || 0) / 100));

  // Determine top-right label
  const getBadgeStatus = () => {
    if (product.isBestSeller) return <span className="card-badge-status badge-bestseller">BEST SELLER</span>;
    if (product.isNew) return <span className="card-badge-status badge-new-status">NEW 💅</span>;
    return <span className="card-badge-status badge-hot-deal">HOT DEAL 🔥</span>;
  };

  return (
    <Link href={`/product/${product.id}`} className="product-card">
      <div className="product-image-area">
        {/* Top-left negative discount pill */}
        {Boolean(product.isOnSale) && (
          <span className="card-badge-discount">-{product.discountPercent}%</span>
        )}
        
        {/* Top-right status badge */}
        {getBadgeStatus()}
        
        {/* Realistic image photo wrapper */}
        <div className="product-photo-wrapper">
          <Image 
            src={imageUrl || '/hero.png'} 
            alt={product.name || 'Product'} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="product-photo"
            unoptimized={true}
          />
          <div className="premium-vignette"></div>
          <div className="premium-watermark">
            <span className="watermark-text">FeelTheWellness</span>
            <span className="watermark-sub">PRO COLLECTION</span>
          </div>
        </div>
        
        {/* Bottom pink slide overlay */}
        <div className="view-product-overlay">
          VIEW PRODUCT
        </div>

        {/* Floating Quick Add Icon Button */}
        <div 
          role="button"
          tabIndex={0}
          className="quick-add-icon-btn" 
          onClick={handleQuickAdd}
          onKeyDown={(e) => { if (e.key === 'Enter') handleQuickAdd(e as any); }}
          aria-label={`Add ${product.name} to Cart`}
          title="Quick Add to Cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
      </div>

      {/* Product Card Thumbnails */}
      {false && (
        <div className="card-thumbnails-row">
        </div>
      )}

      <div className="product-info-area">
        {/* Brand label in small uppercase letters */}
        <span className="product-brand">{brandName}</span>
        
        {/* Product Title */}
        <h3 className="product-title">{product.name}</h3>
        
        {/* Stars & verified reviews */}
        <div className="product-rating-row">
          <div className="stars-container">{renderStars(product.rating)}</div>
          <span className="reviews-count">{product.reviews}</span>
        </div>

        {/* Pricing Layout: original on left (crossed out), sale price on right (larger, bold) */}
        <div className="product-price-row">
          {Boolean(product.isOnSale) && (
            <span className="product-original-price">
              ₹{originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          )}
          <span className="product-price">
            ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Shipping details footer */}
        <div className="shipping-row">
          <span className="shipping-origin">Ships from 🇮🇳</span>
          <span className="shipping-eta">🕒 2-3 Days Delivery</span>
        </div>
      </div>

      <style jsx global>{`
        .product-card {
          display: flex;
          flex-direction: column;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          overflow: hidden;
          transition: var(--transition-smooth);
          height: 100%;
          min-width: 0;
        }

        .product-card:hover {
          transform: translateY(-8px);
          border-color: var(--accent);
          box-shadow: var(--shadow-md), 0 0 15px rgba(255, 42, 133, 0.15);
        }

        .product-image-area {
          position: relative;
          background: #fce4ec; /* Soft lustful pink to cover white bg */
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-bottom: 1px solid var(--border-light);
        }
        
        @media (min-width: 768px) {
          .product-image-area { height: 240px; }
        }

        .product-photo-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          position: relative;
        }

        .product-photo {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          mix-blend-mode: multiply;
        }

        .product-photo-wrapper:hover .product-photo {
          transform: scale(1.05);
        }

        /* Premium Vignette & Watermark */
        .premium-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at center, transparent 30%, rgba(200, 20, 100, 0.2) 100%);
          z-index: 2;
        }

        .premium-watermark {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          pointer-events: none;
          z-index: 3;
          opacity: 0.8;
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }

        .watermark-text {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.05em;
          line-height: 1.1;
        }

        .watermark-sub {
          font-family: var(--font-sans);
          font-size: 0.45rem;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        /* Top-left negative discount pill style */
        .card-badge-discount {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 5;
          background: #731535;
          color: #ff91b8;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid rgba(255, 42, 133, 0.2);
        }

        [data-theme="light"] .card-badge-discount {
          background: #ffe3ec;
          color: var(--accent);
        }

        /* Top-right status badge style */
        .card-badge-status {
          position: absolute;
          top: 12px;
          right: 50px; /* Moved slightly left to make room for quick add on mobile */
          z-index: 5;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }
        
        @media (min-width: 768px) {
          .card-badge-status {
            right: 12px; /* Reset for desktop since quick add moves to bottom */
          }
        }

        .badge-bestseller {
          background: #5c1bb8;
          color: #d1b5ff;
          border: 1px solid rgba(168, 51, 255, 0.3);
        }

        [data-theme="light"] .badge-bestseller {
          background: #efe6ff;
          color: #5c1bb8;
        }

        .badge-new-status {
          background: #b81b5c;
          color: #ffd2e5;
          border: 1px solid rgba(255, 42, 133, 0.3);
        }

        .badge-hot-deal {
          background: #b8781b;
          color: #ffe8cc;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        /* View Product / Add to Cart Overlay */
        .view-product-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--accent);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.85rem;
          text-align: center;
          padding: 10px;
          letter-spacing: 0.08em;
          transform: translateY(0); /* Visible by default on mobile */
          transition: var(--transition-smooth);
          z-index: 8;
        }

        @media (min-width: 768px) {
          .view-product-overlay {
            transform: translateY(100%); /* Hidden by default on desktop */
            padding: 12px;
          }
          .product-card:hover .view-product-overlay {
            transform: translateY(0);
          }
        }

        /* Quick Add Small Circular Button */
        .quick-add-icon-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(10, 5, 13, 0.8);
          color: #ffffff;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9;
          transition: var(--transition-smooth);
          opacity: 1; /* Always visible on mobile */
        }

        .quick-add-icon-btn:hover {
          background: var(--accent);
          color: #ffffff;
          transform: scale(1.1);
        }

        @media (min-width: 768px) {
          .quick-add-icon-btn {
            bottom: 12px;
            right: 12px;
            top: auto;
            width: 36px;
            height: 36px;
            opacity: 0.7;
          }
          .product-card:hover .quick-add-icon-btn {
            opacity: 0;
            pointer-events: none; /* Hide under pink overlay */
          }
        }

        .product-info-area {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        /* Brand Label */
        .product-brand {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--accent);
          letter-spacing: 0.1em;
          margin-bottom: 6px;
        }

        .product-title {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 2.8em;
        }

        .product-rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }

        .stars-container {
          color: #d4af37;
          display: flex;
          font-size: 0.8rem;
        }

        .star.filled {
          opacity: 1;
        }

        .star.empty {
          opacity: 0.2;
        }

        .star.half {
          position: relative;
          color: rgba(255,255,255,0.2);
        }

        .star.half::before {
          content: '★';
          position: absolute;
          left: 0;
          top: 0;
          width: 50%;
          overflow: hidden;
          color: #d4af37;
        }

        .reviews-count {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .product-price-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-top: auto;
          flex-wrap: wrap;
        }

        .product-price {
          font-family: var(--font-sans);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .product-original-price {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-decoration: line-through;
          font-family: var(--font-sans);
        }

        /* Shipping Row */
        .shipping-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.6rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border-light);
          padding-top: 8px;
          flex-wrap: wrap;
          gap: 4px;
        }

        .shipping-origin {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>
    </Link>
  );
}
