import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { ItemData } from '../types';

interface ItemFormProps {
  onSubmit: (item: Omit<ItemData, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: ItemData;
}

export const ShowForm: React.FC<ItemFormProps> = ({ onSubmit, onCancel, initialData }) => {
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
        <h2 className="text-xl font-bold text-slate-800">{initialData ? 'Show Text' : 'Add Text'}</h2>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Form Entry</span>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Text Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <div
            className="px-4 py-2 rounded-lg border border-gray-300">{formData.content}
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
          {/*
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm"
          >
            {initialData ? 'Update Item' : 'Save Item'}
          </button>
          */}
        </div>
      </form>
    </div>
  );
};
