import React from 'react';
import { ItemData } from '../types';
//import { Trash2, Pencil } from 'lucide-react';

interface ItemListProps {
  items: ItemData[];
  onAddItem: () => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: ItemData) => void;
}

export const ItemList: React.FC<ItemListProps> = ({ items, onAddItem, onDeleteItem, onEditItem }) => {
  if (items.length === 0) {
    return ""
    /*
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
        <div className="mx-auto h-12 w-12 text-slate-300 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-slate-900">No items found</h3>
        <p className="mt-1 text-sm text-slate-500">Get started by creating a new inventory item.</p>
        <div className="mt-6">
          <button
            onClick={onAddItem}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Item
          </button>
        </div>
      </div>
    );
    */
  }

  const handleDeleteClick = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDeleteItem(id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
          <div className="p-5 flex-1">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-slate-900 truncate pr-2">{item.title}</h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.publicType === 'public' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  {item.publicType === 'public' ? 'Public' : 'Private'}
                </span>
                <button
                  onClick={() => onEditItem(item)}
                  className="p-1 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  aria-label="Edit item"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(item.id, item.title)}
                  className="p-1 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  aria-label="Delete item"
                >
                  delte
                  {/* <Trash2 className="h-4 w-4" /> */}
                </button>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[2.5em]">{item.content}</p>
            
            <div className="space-y-4">
              {/* Foods */}
              <div className="flex flex-wrap gap-2">
                {item.foodOrange && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                    🍊 Orange
                  </span>
                )}
                {item.foodApple && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                    🍎 Apple
                  </span>
                )}
                {item.foodBanana && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
                    🍌 Banana
                  </span>
                )}
                {!item.foodOrange && !item.foodApple && !item.foodBanana && (
                  <span className="text-xs text-slate-400 italic">No food items selected</span>
                )}
              </div>

              {/* Quantities */}
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 rounded-lg p-2">
                <div>
                  <div className="text-xs text-slate-500 uppercase">Qty 1</div>
                  <div className="font-mono font-semibold text-slate-800">{item.qty1}</div>
                </div>
                <div className="border-l border-slate-200">
                  <div className="text-xs text-slate-500 uppercase">Qty 2</div>
                  <div className="font-mono font-semibold text-slate-800">{item.qty2}</div>
                </div>
                <div className="border-l border-slate-200">
                  <div className="text-xs text-slate-500 uppercase">Qty 3</div>
                  <div className="font-mono font-semibold text-slate-800">{item.qty3}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <span>ID: {item.id.slice(0, 8)}</span>
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
