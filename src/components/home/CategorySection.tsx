import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutTemplate, Share2, Calendar, BookOpen, 
  Palette, FileText, Sparkles, Folder, ArrowRight 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutTemplate,
  Share2,
  Calendar,
  BookOpen,
  Palette,
  FileText,
  Sparkles,
  Folder
};

export const CategorySection: React.FC = () => {
  const { categories } = useStore();

  return (
    <section className="py-12 bg-white border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy">Shop by Category</h2>
            <p className="text-xs sm:text-sm text-brand-secondary mt-1">
              Curated digital design assets and tools for creators & entrepreneurs
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-cobalt hover:text-cobalt-hover group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon_name || 'Folder'] || Folder;
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="group flex flex-col items-center p-5 rounded-2xl bg-[#F3F6FB] border border-[#DCE3EF] hover:border-[#4169E1] hover:bg-white hover:shadow-card-hover transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-surface-border group-hover:border-cobalt/30 group-hover:bg-cobalt/5 flex items-center justify-center text-cobalt transition-colors mb-3 shadow-xs">
                  <IconComponent className="w-6 h-6 transition-transform group-hover:scale-110" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-navy group-hover:text-cobalt transition-colors leading-tight">
                  {cat.name}
                </h3>
                {typeof cat.product_count === 'number' && (
                  <span className="text-[11px] text-brand-secondary mt-1">
                    {cat.product_count} {cat.product_count === 1 ? 'item' : 'items'}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
