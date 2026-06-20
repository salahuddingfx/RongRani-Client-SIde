import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
};

const MAX_COMPARE = 3;

export const CompareProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const toggleCompare = useCallback((product) => {
    setItems(prev => {
      const exists = prev.find(p => (p._id || p.id) === (product._id || product.id));
      if (exists) {
        return prev.filter(p => (p._id || p.id) !== (product._id || product.id));
      }
      if (prev.length >= MAX_COMPARE) {
        toast.error(`You can compare up to ${MAX_COMPARE} products`);
        return prev;
      }
      toast.success(`${product.name} added to compare`);
      return [...prev, {
        _id: product._id,
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images,
        image: product.image,
        category: product.category,
        description: product.description,
        stock: product.stock,
        rating: product.rating,
        tags: product.tags,
        sku: product.sku,
      }];
    });
  }, []);

  const isComparing = useCallback((productId) => {
    return items.some(p => (p._id || p.id) === productId);
  }, [items]);

  const clearCompare = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({
    items,
    count: items.length,
    maxCompare: MAX_COMPARE,
    toggleCompare,
    isComparing,
    clearCompare,
  }), [items, toggleCompare, isComparing, clearCompare]);

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
};
