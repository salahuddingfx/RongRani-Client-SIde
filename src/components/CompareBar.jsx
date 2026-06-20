import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GitCompareArrows, X, ArrowRight } from 'lucide-react';
import { useCompare } from '../contexts/CompareContext';

const CompareBar = () => {
  const { items, count, maxCompare, clearCompare, toggleCompare } = useCompare();
  const [expanded, setExpanded] = useState(false);

  if (count === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Compact bar */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-maroon/10 flex items-center justify-center flex-shrink-0">
            <GitCompareArrows className="h-4 w-4 text-maroon" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-white">{count}/{maxCompare} selected</p>
          </div>
          <button onClick={() => setExpanded(!expanded)} className="text-xs font-semibold text-maroon hover:underline">
            {expanded ? 'Hide' : 'View'}
          </button>
          <button onClick={clearCompare} className="text-slate-400 hover:text-red-500 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Expanded preview */}
        {expanded && (
          <div className="px-4 pb-3 border-t border-slate-100 dark:border-slate-700 pt-3">
            <div className="flex gap-3 mb-3">
              {items.map((p) => (
                <div key={p._id || p.id} className="relative flex-1 min-w-0">
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-2 text-center">
                    <img
                      src={p.images?.[0]?.url || p.images?.[0] || 'https://via.placeholder.com/80'}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded-lg mx-auto mb-1"
                    />
                    <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate">{p.name}</p>
                    <p className="text-[10px] font-bold text-maroon">৳{p.price?.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => toggleCompare(p)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: maxCompare - count }).map((_, i) => (
                <div key={`empty-${i}`} className="flex-1 min-w-0">
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-2 text-center h-[76px] flex items-center justify-center">
                    <span className="text-[10px] text-slate-400">Add product</span>
                  </div>
                </div>
              ))}
            </div>
            {count >= 2 && (
              <Link
                to="/compare"
                className="w-full bg-maroon text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-maroon-dark transition-colors"
              >
                Compare Now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareBar;
