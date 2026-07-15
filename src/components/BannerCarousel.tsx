'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Banner {
  id: string;
  src: string;
  alt: string;
  link: string;
  headline: string;
  subtext: string;
  cta: string;
}

const banners: Banner[] = [
  {
    id: 'sale_1',
    src: '/banners/banner_sale_new_1.jpg',
    alt: 'Flash Sale - Up to 60% Off',
    link: '/catalog',
    headline: 'Sensual Summer Sale',
    subtext: 'Up to 60% Off Premium Toys',
    cta: 'Shop Sale',
  },
  {
    id: 'sale_2',
    src: '/banners/banner_sale_2.jpg',
    alt: 'Midnight Indulgence Sale - Up to 50% Off',
    link: '/catalog',
    headline: 'Midnight Indulgence',
    subtext: 'Discover Your New Obsession',
    cta: 'Explore Now',
  },
  {
    id: 'sale_3',
    src: '/banners/banner_sale_3.jpg',
    alt: 'Massive Adult Boutique Sale',
    link: '/catalog?category=Women%20Sex%20Toys',
    headline: 'For Her Pleasure',
    subtext: 'Luxury Vibrators & Dildos',
    cta: 'Shop Women',
  },
  {
    id: 'sale_4',
    src: '/banners/banner_sale_4.jpg',
    alt: 'Intimate Couples Mega Discount',
    link: '/catalog?category=Couple%27s%20Play',
    headline: 'Better Together',
    subtext: 'Couples Toys & Kits',
    cta: 'Shop Couples',
  }
];

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentIndex(index);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  // Touch handlers
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div className="banner-carousel-container" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div className="carousel-slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {banners.map((banner, index) => (
          <div key={banner.id} className="carousel-slide">
            <Link href={banner.link} className="carousel-link">
              <Image 
                src={banner.src} 
                alt={banner.alt} 
                fill
                priority={index === 0}
                unoptimized={true}
                className="carousel-image"
              />
              <div className="banner-gradient"></div>
              <div className="banner-content">
                <h2>{banner.headline}</h2>
                <p>{banner.subtext}</p>
                <span className="banner-btn">{banner.cta}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <button className="carousel-control prev" onClick={prevSlide} aria-label="Previous banner">
        &#10094;
      </button>
      <button className="carousel-control next" onClick={nextSlide} aria-label="Next banner">
        &#10095;
      </button>

      <div className="carousel-indicators">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <style jsx>{`
        .banner-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,4,6,0.9) 0%, rgba(10,4,6,0.3) 50%, rgba(10,4,6,0.1) 100%);
          z-index: 1;
        }
        .banner-content {
          position: absolute;
          bottom: 40px;
          left: 20px;
          right: 20px;
          z-index: 2;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .banner-content h2 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 4px;
          line-height: 1.1;
        }
        .banner-content p {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.9);
          margin-bottom: 12px;
        }
        .banner-btn {
          display: inline-block;
          background: var(--accent);
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          box-shadow: 0 4px 12px rgba(255, 42, 133, 0.4);
        }
        @media (min-width: 768px) {
          .banner-content {
            bottom: 60px;
            left: 40px;
          }
          .banner-content h2 { font-size: 2.8rem; }
          .banner-content p { font-size: 1.2rem; margin-bottom: 20px; }
          .banner-btn { padding: 12px 28px; font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}

