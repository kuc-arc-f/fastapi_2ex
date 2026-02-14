import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { ItemData } from '../types';

interface ItemFormProps {
  onSubmit: (item: Omit<ItemData, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: ItemData;
}

export const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    publicType: 'public' as 'public' | 'private',
    foodOrange: false,
    foodApple: false,
    foodBanana: false,
    qty1: 0,
    qty2: 0,
    qty3: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        publicType: initialData.publicType,
        foodOrange: initialData.foodOrange,
        foodApple: initialData.foodApple,
        foodBanana: initialData.foodBanana,
        qty1: initialData.qty1,
        qty2: initialData.qty2,
        qty3: initialData.qty3,
      });
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
  
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'radio') {
        setFormData(prev => ({ ...prev, [name]: value as 'public' | 'private' }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">{initialData ? 'Edit Inventory' : 'Add New Inventory'}</h2>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Form Entry</span>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Text Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Enter item title..."
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <input
              type="text"
              id="content"
              name="content"
              required
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Enter description..."
            />
          </div>
        </div>

        {/* Visibility Radio */}
        <div>
          <span className="block text-sm font-medium text-slate-700 mb-2">Visibility Type</span>
          <div className="flex gap-4">
            <label className="relative flex items-center p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 w-full transition-colors">
              <input
                type="radio"
                name="publicType"
                value="public"
                checked={formData.publicType === 'public'}
                onChange={handleChange}
                className="h-4 w-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
              />
              <span className="ml-3 text-sm font-medium text-slate-900">Public</span>
            </label>
            <label className="relative flex items-center p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 w-full transition-colors">
              <input
                type="radio"
                name="publicType"
                value="private"
                checked={formData.publicType === 'private'}
                onChange={handleChange}
                className="h-4 w-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
              />
              <span className="ml-3 text-sm font-medium text-slate-900">Private</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Checkboxes */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <span className="block text-sm font-medium text-slate-700 mb-3">Food Categories</span>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="foodOrange"
                  checked={formData.foodOrange}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-slate-700">Orange</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="foodApple"
                  checked={formData.foodApple}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-slate-700">Apple</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="foodBanana"
                  checked={formData.foodBanana}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-slate-700">Banana</span>
              </label>
            </div>
          </div>

          {/* Quantities */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <span className="block text-sm font-medium text-slate-700 mb-3">Inventory Quantities</span>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="qty1" className="text-sm text-slate-600">Quantity 1</label>
                <input
                  type="number"
                  name="qty1"
                  id="qty1"
                  value={formData.qty1}
                  onChange={handleChange}
                  min="0"
                  className="w-24 px-3 py-1 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="qty2" className="text-sm text-slate-600">Quantity 2</label>
                <input
                  type="number"
                  name="qty2"
                  id="qty2"
                  value={formData.qty2}
                  onChange={handleChange}
                  min="0"
                  className="w-24 px-3 py-1 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="qty3" className="text-sm text-slate-600">Quantity 3</label>
                <input
                  type="number"
                  name="qty3"
                  id="qty3"
                  value={formData.qty3}
                  onChange={handleChange}
                  min="0"
                  className="w-24 px-3 py-1 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-4 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm"
          >
            {initialData ? 'Update Item' : 'Save Item'}
          </button>
        </div>
      </form>
    </div>
  );
};
