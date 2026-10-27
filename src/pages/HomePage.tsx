import React from 'react';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { CategorySection } from '../components/home/CategorySection';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { BenefitsSection } from '../components/home/BenefitsSection';

export const HomePage: React.FC = () => {
  return (
    <div>
      <HeroCarousel />
      <CategorySection />
      <FeaturedProducts />
      <BenefitsSection />
    </div>
  );
};
