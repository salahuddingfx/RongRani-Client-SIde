import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingCart, Truck, Star, ArrowLeft } from 'lucide-react';
import { useCompare } from '../contexts/CompareContext';
import { useCart } from '../contexts/CartContext';
import { playCartSound } from '../utils/sounds';
import toast from 'react-hot-toast';
import Breadcrumb from '../components/Breadcrumb';

const ComparePage = () => {
  const { items, toggleCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/200';
    if (typeof img === 'string') return img;
    return img.url || 'https://via.placeholder.com/200';
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    playCartSound();
    toast.success(`${product.name} added to cart!`);
  };

  if (items.length < 2) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-8 px-4">
        <Breadcrumb items={[{ label: 'Compare Products' }]} />
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Add products to compare</h2>
          <p className="text-sm text-slate-500 mb-6">Select at least 2 products from the shop to compare them side by side.</p>
          <Link to="/shop" className="bg-maroon text-white px-6 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 hover:bg-maroon-dark">
            <ArrowLeft className="h-4 w-4" /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const specs = [
    { key: 'price', label: 'Price', render: (p) => `৳${p.price?.toLocaleString()}` },
    { key: 'originalPrice', label: 'Original Price', render: (p) => p.originalPrice ? `৳${p.originalPrice.toLocaleString()}` : '-' },
    { key: 'category', label: 'Category', render: (p) => p.category || '-' },
    { key: 'stock', label: 'Availability', render: (p) => p.stock > 0 ? 'In Stock' : 'Out of Stock', className: (p) => p.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold' },
    { key: 'rating', label: 'Rating', render: (p) => p.rating ? `${p.rating}/5 ⭐` : 'No rating' },
    { key: 'sku', label: 'SKU', render: (p) => p.sku || '-' },
    { key: 'description', label: 'Description', render: (p) => p.description || '-', className: () => 'text-xs leading-relaxed' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-8 px-4">
      <Breadcrumb items={[{ label: 'Compare Products' }]} />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Compare Products ({items.length})</h1>
          <button onClick={clearCompare} className="text-sm font-semibold text-red-500 hover:text-red-600">Clear All</button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Product headers */}
              <thead>
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 w-36"></th>
                  {items.map((p) => (
                    <th key={p._id || p.id} className="p-4 text-center min-w-[200px]">
                      <div className="relative">
                        <button onClick={() => toggleCompare(p)} className="absolute -top-1 -right-1 w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 z-10">
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <Link to={`/product/${p.slug || p._id}`}>
                          <img src={getImageUrl(p.images?.[0] || p.image)} alt={p.name} className="w-24 h-24 object-cover rounded-xl mx-auto mb-2 hover:scale-105 transition-transform" />
                          <p className="text-sm font-bold text-slate-900 dark:text-white hover:text-maroon transition-colors line-clamp-2">{p.name}</p>
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Specs rows */}
              <tbody>
                {specs.map((spec, idx) => (
                  <tr key={spec.key} className={idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-700/30' : ''}>
                    <td className="p-3 text-xs font-semibold text-slate-500 pl-4">{spec.label}</td>
                    {items.map((p) => (
                      <td key={p._id || p.id} className={`p-3 text-center text-sm text-slate-700 dark:text-slate-300 ${spec.className ? spec.className(p) : ''}`}>
                        {spec.render(p)}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Add to Cart row */}
                <tr className="border-t border-slate-100 dark:border-slate-700">
                  <td className="p-4"></td>
                  {items.map((p) => (
                    <td key={p._id || p.id} className="p-4 text-center">
                      <div className="flex flex-col gap-2 items-center">
                        <button
                          onClick={() => handleAddToCart(p)}
                          disabled={p.stock === 0}
                          className="w-full max-w-[180px] bg-maroon text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-maroon-dark transition-colors disabled:opacity-40"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                        </button>
                        <button
                          onClick={() => { addToCart(p); navigate('/checkout'); }}
                          disabled={p.stock === 0}
                          className="w-full max-w-[180px] border border-maroon text-maroon py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-maroon hover:text-white transition-colors disabled:opacity-40"
                        >
                          <Truck className="h-3.5 w-3.5" /> Buy Now
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
