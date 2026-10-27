import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { HomepageSlide } from '../../types/database';
import { storeService } from '../../services/storeService';

export const HeroCarousel: React.FC = () => {
  const [slides, setSlides] = useState<HomepageSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchSlides() {
      const data = await storeService.getSlides();
      const active = data.filter(s => s.is_active);
      setSlides(active.length > 0 ? active : data);
    }
    fetchSlides();
  }, []);

  // Auto advance every 6 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const current = slides[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  return (
    <div className="relative bg-[#F3F6FB] overflow-hidden border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[420px]">
          
          {/* Left Text Content */}
          <div className="lg:col-span-6 space-y-5 animate-in fade-in duration-500">
            <div className="inline-flex items-center gap-2 bg-cobalt/10 border border-cobalt/20 text-cobalt px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Digital Products</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#17294B] tracking-tight leading-tight">
              {current.title}
            </h1>

            <p className="text-base sm:text-lg text-[#68758B] max-w-xl leading-relaxed">
              {current.subtitle}
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link
                to={current.button_url || '/shop'}
                className="inline-flex items-center gap-2.5 bg-[#4169E1] hover:bg-[#3154C4] text-white px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>{current.button_text || 'Shop Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="hidden sm:inline-flex items-center text-sm font-semibold text-[#24324A] hover:text-[#4169E1] px-4 py-3 rounded-xl transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Banner Image */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-lg aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white group">
              <img
                src={current.image_url}
                alt={current.title}
                className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-tr from-navy-dark/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-3 -left-2 sm:bottom-4 sm:left-4 bg-white/95 backdrop-blur-md border border-surface-border shadow-lg rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-navy">Instant Download</p>
                <p className="text-[11px] text-brand-secondary">Get Canva & PDF files right away</p>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Navigation Arrows & Indicators */}
        {slides.length > 1 && (
          <div className="flex items-center justify-between sm:justify-center gap-6 mt-8">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full bg-white border border-surface-border text-brand-text hover:text-cobalt hover:border-cobalt flex items-center justify-center shadow-xs transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-8 bg-cobalt' : 'w-2.5 bg-surface-border hover:bg-brand-secondary'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full bg-white border border-surface-border text-brand-text hover:text-cobalt hover:border-cobalt flex items-center justify-center shadow-xs transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
