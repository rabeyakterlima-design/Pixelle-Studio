import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Folder, Check, X, AlertCircle } from 'lucide-react';
import { Category } from '../../types/database';
import { storeService } from '../../services/storeService';
import { useStore } from '../../context/StoreContext';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, refreshStore } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('LayoutTemplate');
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenModal = (cat?: Category) => {
    setErrorMessage('');
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
      setSlug(cat.slug);
      setDescription(cat.description || '');
      setIconName(cat.icon_name || 'LayoutTemplate');
      setIsActive(cat.is_active);
    } else {
      setEditingCategory(null);
      setName('');
      setSlug('');
      setDescription('');
      setIconName('Folder');
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Category name is required.');
      return;
    }

    try {
      await storeService.saveCategory({
        id: editingCategory?.id,
        name: name.trim(),
        slug: slug.trim() || undefined,
        description,
        icon_name: iconName,
        is_active: isActive
      });

      await refreshStore();
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      const result = await storeService.deleteCategory(id);
      if (!result.success) {
        alert(result.error);
        return;
      }
      await refreshStore();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Add */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Categories Management</h1>
          <p className="text-xs text-brand-secondary mt-1">
            Organize digital products into structured collections with icons and slugs
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-cobalt hover:bg-cobalt-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Table matching mockup */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-light border-b border-surface-border text-brand-secondary uppercase font-semibold">
              <tr>
                <th className="py-3 px-6">#</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Icon Identifier</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-surface-light/40 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-brand-secondary">{idx + 1}</td>
                  <td className="py-3.5 px-4 font-bold text-navy">{cat.name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{cat.slug}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-surface-light px-2 py-0.5 rounded font-mono text-[11px] text-brand-secondary">
                      {cat.icon_name || 'Folder'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-cobalt">
                    {cat.product_count ?? 0}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      cat.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(cat)}
                      className="p-1 text-slate-400 hover:text-cobalt transition-colors"
                      title="Edit Category"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-dark/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-modal border border-surface-border animate-in fade-in">
            <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
              <h3 className="text-base font-bold text-navy">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Canva Templates"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Slug (URL)</label>
                <input
                  type="text"
                  placeholder="e.g. canva-templates"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Icon Name</label>
                <select
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                >
                  <option value="LayoutTemplate">LayoutTemplate (Canva)</option>
                  <option value="Share2">Share2 (Social Media)</option>
                  <option value="Calendar">Calendar (Planners)</option>
                  <option value="BookOpen">BookOpen (Ebooks)</option>
                  <option value="Palette">Palette (Graphics & Colors)</option>
                  <option value="FileText">FileText (Digital Papers)</option>
                  <option value="Sparkles">Sparkles (Others / Creative)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-cobalt w-4 h-4"
                />
                <span>Active Category</span>
              </label>

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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
