import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Image as ImageIcon, Eye, Check, X } from 'lucide-react';
import { HomepageSlide } from '../../types/database';
import { storeService } from '../../services/storeService';

export const AdminSlidesPage: React.FC = () => {
  const [slides, setSlides] = useState<HomepageSlide[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<HomepageSlide> | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonText, setButtonText] = useState('Shop Now');
  const [buttonUrl, setButtonUrl] = useState('/shop');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    const list = await storeService.getSlides();
    setSlides(list);
  };

  const handleOpenModal = (slide?: HomepageSlide) => {
    if (slide) {
      setEditingSlide(slide);
      setTitle(slide.title);
      setSubtitle(slide.subtitle);
      setImageUrl(slide.image_url);
      setButtonText(slide.button_text);
      setButtonUrl(slide.button_url);
      setDisplayOrder(slide.display_order);
      setIsActive(slide.is_active);
    } else {
      setEditingSlide(null);
      setTitle('');
      setSubtitle('');
      setImageUrl('https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80');
      setButtonText('Shop Now');
      setButtonUrl('/shop');
      setDisplayOrder(slides.length + 1);
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    await storeService.saveSlide({
      id: editingSlide?.id || `slide-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      image_url: imageUrl.trim(),
      button_text: buttonText.trim(),
      button_url: buttonUrl.trim(),
      display_order: Number(displayOrder),
      is_active: isActive
    });

    setIsModalOpen(false);
    await loadSlides();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this carousel slide?')) {
      await storeService.deleteSlide(id);
      await loadSlides();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Homepage Carousel Manager</h1>
          <p className="text-xs text-brand-secondary mt-1">
            Manage high-converting hero banner slides, typography, images, and CTA destinations
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-cobalt hover:bg-cobalt-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="aspect-16/9 bg-surface-light relative overflow-hidden">
                <img src={s.image_url} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-navy/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                  Slide #{s.display_order}
                </span>
                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs ${
                  s.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                }`}>
                  {s.is_active ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-sm font-bold text-navy">{s.title}</h3>
                <p className="text-xs text-brand-secondary line-clamp-2">{s.subtitle}</p>
                <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-cobalt">
                  <span>Button: "{s.button_text}"</span>
                  <span>→</span>
                  <span className="font-mono text-slate-500">{s.button_url}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-light border-t border-surface-border flex justify-end gap-2">
              <button
                onClick={() => handleOpenModal(s)}
                className="p-1.5 text-slate-400 hover:text-cobalt transition-colors"
                title="Edit slide"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                title="Delete slide"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-dark/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-modal border border-surface-border animate-in fade-in">
            <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
              <h3 className="text-base font-bold text-navy">
                {editingSlide ? 'Edit Slide' : 'Create Slide'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-navy mb-1">Slide Heading *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beautiful Templates for Your Creative Journey"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Subtitle</label>
                <textarea
                  rows={2}
                  placeholder="Subtitle text..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Banner Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Button Text</label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Button URL</label>
                  <input
                    type="text"
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded text-cobalt w-4 h-4"
                    />
                    <span>Active Slide</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-xs font-bold text-brand-text hover:bg-surface-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cobalt text-white text-xs font-bold hover:bg-cobalt-hover shadow-xs"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
