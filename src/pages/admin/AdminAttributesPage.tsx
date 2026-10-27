import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Sliders, Sparkles, Layers } from 'lucide-react';
import { ProductAttribute } from '../../types/database';
import { storeService } from '../../services/storeService';

export const AdminAttributesPage: React.FC = () => {
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [newAttrName, setNewAttrName] = useState('');
  const [newValueInput, setNewValueInput] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await storeService.getAttributes();
      setAttributes(data);
    }
    load();
  }, []);

  const handleAddAttribute = () => {
    if (!newAttrName.trim()) return;
    const newAttr: ProductAttribute = {
      id: `attr-${Date.now()}`,
      name: newAttrName.trim(),
      slug: newAttrName.toLowerCase().replace(/\s+/g, '-'),
      values: []
    };
    const updated = [...attributes, newAttr];
    setAttributes(updated);
    storeService.saveAttributes(updated);
    setNewAttrName('');
  };

  const handleAddValue = (attrId: string) => {
    const valText = newValueInput[attrId]?.trim();
    if (!valText) return;

    const updated = attributes.map(attr => {
      if (attr.id === attrId) {
        const values = attr.values || [];
        const newVal = {
          id: `val-${Date.now()}`,
          attribute_id: attrId,
          value: valText,
          slug: valText.toLowerCase().replace(/\s+/g, '-')
        };
        return { ...attr, values: [...values, newVal] };
      }
      return attr;
    });

    setAttributes(updated);
    storeService.saveAttributes(updated);
    setNewValueInput({ ...newValueInput, [attrId]: '' });
  };

  const handleDeleteValue = (attrId: string, valId: string) => {
    const updated = attributes.map(attr => {
      if (attr.id === attrId) {
        return { ...attr, values: (attr.values || []).filter(v => v.id !== valId) };
      }
      return attr;
    });
    setAttributes(updated);
    storeService.saveAttributes(updated);
  };

  const handleDeleteAttribute = (attrId: string) => {
    if (window.confirm('Delete this attribute and all its options?')) {
      const updated = attributes.filter(a => a.id !== attrId);
      setAttributes(updated);
      storeService.saveAttributes(updated);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Attributes & Variations System</h1>
          <p className="text-xs text-brand-secondary mt-1">
            Configure global attributes (Size, Colour, License, Format) used to generate variable product matrices
          </p>
        </div>
      </div>

      {/* Add New Attribute Box */}
      <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="New attribute name (e.g. License Tier, Page Orientation, Resolution)..."
          value={newAttrName}
          onChange={(e) => setNewAttrName(e.target.value)}
          className="flex-1 w-full bg-surface-light border border-surface-border rounded-xl px-4 py-2.5 text-xs text-brand-text focus:outline-none focus:border-cobalt"
        />
        <button
          onClick={handleAddAttribute}
          className="bg-cobalt hover:bg-cobalt-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Attribute</span>
        </button>
      </div>

      {/* Attribute Cards Grid matching mockup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {attributes.map((attr) => (
          <div key={attr.id} className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cobalt" />
                  <h3 className="text-sm font-bold text-navy">{attr.name}</h3>
                  <span className="text-[10px] text-brand-secondary font-mono">({attr.slug})</span>
                </div>
                <button
                  onClick={() => handleDeleteAttribute(attr.id)}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                  title="Delete Attribute"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Values Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {attr.values?.map((val) => (
                  <span
                    key={val.id}
                    className="inline-flex items-center gap-1.5 bg-surface-light text-navy border border-surface-border px-3 py-1.5 rounded-xl text-xs font-semibold group"
                  >
                    {val.color_code && (
                      <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: val.color_code }} />
                    )}
                    <span>{val.value}</span>
                    <button
                      onClick={() => handleDeleteValue(attr.id, val.id)}
                      className="text-slate-400 hover:text-rose-500 ml-1"
                      title="Remove option"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Add Option */}
            <div className="flex items-center gap-2 pt-3 border-t border-surface-border">
              <input
                type="text"
                placeholder={`Add value to ${attr.name}...`}
                value={newValueInput[attr.id] || ''}
                onChange={(e) => setNewValueInput({ ...newValueInput, [attr.id]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddValue(attr.id)}
                className="flex-1 bg-surface-light border border-surface-border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-cobalt"
              />
              <button
                onClick={() => handleAddValue(attr.id)}
                className="bg-navy hover:bg-navy-dark text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors shrink-0"
              >
                + Add
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
