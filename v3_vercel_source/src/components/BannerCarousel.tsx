'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Banner {
  id: string;
  src: string;
  alt: string;
  link: string;
}

const banners: Banner[] = [
  {
    id: 'sale_1',
    src: '/banners/banner_sale_new_1.jpg',
    alt: 'Flash Sale - Up to 60% Off',
    link: '/catalog',
  },
  {
    id: 'sale_2',
    src: '/banners/banner_sale_2.jpg',
    alt: 'Midnight Indulgence Sale - Up to 50% Off',
    link: '/catalog',
  },
  {
    id: 'sale_3',
    src: '/banners/banner_sale_3.jpg',
    alt: 'Massive Adult Boutique Sale',
    link: '/catalog?category=Women%20Sex%20Toys',
  },
  {
    id: 'sale_4',
    src: '/banners/banner_sale_4.jpg',
    alt: 'Intimate Couples Mega Discount',
    link: '/catalog?category=Couple%27s%20Play',
  }
];

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Auto slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  return (
    <div className="banner-carousel-container">
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
    </div>
  );
}
