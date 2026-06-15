"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function HeroBanner() {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/banners")
      .then(res => res.json())
      .then(data => {
        if (data.banners) setBanners(data.banners);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 mt-6">
        <div className="relative w-full h-[200px] md:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-brand animate-spin" />
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    // Fallback if no banners
    return (
      <div className="container mx-auto px-4 lg:px-8 mt-6">
        <div className="relative w-full h-[200px] md:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-r from-brand-dark via-brand to-brand-light flex items-center justify-center shadow-lg">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Welcome to SeaBasket</h1>
            <p className="text-lg md:text-xl font-medium mb-8 opacity-90">Fresh catch delivered straight to your door.</p>
          </div>
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="container mx-auto px-4 lg:px-8 mt-6">
      <div className="relative w-full h-[200px] md:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-r from-brand-dark via-brand to-brand-light flex items-center justify-center shadow-lg transition-all duration-500">
        
        {banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="text-center text-white px-4">
              <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight transition-transform duration-700 transform translate-y-0">{banner.title}</h1>
              <p className="text-lg md:text-xl font-medium mb-8 opacity-90">{banner.subtitle}</p>
              {banner.category && (
                <Link href={`/category/${banner.category.slug}`}>
                  <button className="bg-white text-brand px-8 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors shadow-md">
                    Order Now
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}

        {/* Carousel indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/75'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
