import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Star, ThumbsUp, MessageCircle, Filter, Search, TrendingUp, Award, Users, X, PenLine } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Seo from '../components/Seo';
import ReviewForm from '../components/ReviewForm';

const ReviewCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 animate-pulse">
    <div className="flex gap-4">
      <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
      </div>
    </div>
  </div>
);

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [stats, setStats] = useState({
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });
    const { t, language } = useLanguage();

    useEffect(() => {
        fetchReviews();
    }, [filter]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/reviews/all', {
                params: { filter, search: searchTerm }
            });
            setReviews(response.data.reviews || []);
            setStats(response.data.stats || stats);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
            setStats({
                totalReviews: 0,
                averageRating: 0,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            setProductsLoading(true);
            const response = await axios.get('/api/products', { params: { limit: 20 } });
            setProducts(response.data.products || response.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setProductsLoading(false);
        }
    };

    const handleWriteReview = () => {
        setShowReviewForm(true);
        fetchProducts();
    };

    const handleSelectProduct = (productId) => {
        setSelectedProductId(productId);
    };

    const handleReviewFormClose = () => {
        setShowReviewForm(false);
        setSelectedProductId(null);
    };

    const handleReviewSubmitted = () => {
        handleReviewFormClose();
        fetchReviews();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return language === 'bn' ? 'আজ' : 'Today';
        if (diffDays === 2) return language === 'bn' ? 'গতকাল' : 'Yesterday';
        if (diffDays <= 7) return language === 'bn' ? `${diffDays} দিন আগে` : `${diffDays} days ago`;

        return date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRatingPercentage = (rating) => {
        if (stats.totalReviews === 0) return 0;
        return ((stats.ratingDistribution[rating] / stats.totalReviews) * 100).toFixed(1);
    };

    return (
        <>
            <Seo
                title={language === 'bn' ? 'কাস্টমার রিভিউ | RongRani' : 'Customer Reviews | RongRani'}
                description={language === 'bn' ? 'আমাদের কাস্টমারদের সত্যিকারের রিভিউ এবং মতামত দেখুন' : 'Read genuine customer reviews and ratings for our products'}
                path="/reviews"
            />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-8 md:py-12">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8 md:mb-10">
                        <div className="inline-flex items-center gap-2 bg-maroon/10 px-3 py-1.5 rounded-full mb-3">
                            <Award className="w-4 h-4 text-maroon" />
                            <span className="text-xs font-bold text-maroon uppercase tracking-wider">
                                {language === 'bn' ? 'কাস্টমার রিভিউ' : 'Customer Reviews'}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                            {language === 'bn' ? 'আমাদের কাস্টমাররা কী বলছেন' : 'What Our Customers Say'}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm mb-4">
                            {language === 'bn'
                                ? 'সত্যিকারের কাস্টমারদের সত্যিকারের মতামত। আমরা গর্বিত যে আমাদের পণ্য এবং সেবা নিয়ে।'
                                : 'Real reviews from real customers. We take pride in our products and service.'}
                        </p>
                        <button
                            onClick={handleWriteReview}
                            className="inline-flex items-center gap-2 bg-maroon text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-maroon/90 transition-colors"
                        >
                            <PenLine className="w-4 h-4" />
                            {language === 'bn' ? 'রিভিউ লিখুন' : 'Write a Review'}
                        </button>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 md:mb-10">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                            <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                                {stats.averageRating.toFixed(1)}
                            </div>
                            <div className="flex items-center justify-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const isFull = stats.averageRating >= star;
                                    const isHalf = !isFull && stats.averageRating >= (star - 0.5);
                                    return (
                                        <div key={star} className="relative w-5 h-5">
                                            <Star className="w-5 h-5 text-slate-300" />
                                            {isHalf && (
                                                <Star
                                                    className="w-5 h-5 fill-yellow-400 text-yellow-400 absolute top-0 left-0"
                                                    style={{ clipPath: 'inset(0 50% 0 0)' }}
                                                />
                                            )}
                                            {isFull && (
                                                <Star
                                                    className="w-5 h-5 fill-yellow-400 text-yellow-400 absolute top-0 left-0"
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-slate-500 text-xs font-semibold">
                                {language === 'bn' ? 'গড় রেটিং' : 'Average Rating'}
                            </p>
                        </div>

                        <div className="bg-maroon rounded-2xl p-6 text-center text-white shadow-sm">
                            <Users className="w-8 h-8 mx-auto mb-3 opacity-90" />
                            <div className="text-3xl md:text-4xl font-bold mb-1">
                                {stats.totalReviews}+
                            </div>
                            <p className="text-white/80 text-xs font-semibold">
                                {language === 'bn' ? 'মোট রিভিউ' : 'Total Reviews'}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm">
                                {language === 'bn' ? 'রেটিং বিতরণ' : 'Rating Distribution'}
                            </h3>
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center gap-2 text-sm">
                                        <span className="text-slate-500 w-8 flex items-center gap-0.5">{rating}<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /></span>
                                        <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-maroon h-full rounded-full transition-all duration-500"
                                                style={{ width: `${getRatingPercentage(rating)}%` }}
                                            />
                                        </div>
                                        <span className="text-slate-400 text-xs w-12 text-right">
                                            {getRatingPercentage(rating)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm mb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={language === 'bn' ? 'রিভিউ খুঁজুন...' : 'Search reviews...'}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-maroon/20 focus:border-maroon transition-colors text-sm bg-slate-50 dark:bg-slate-900/50"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: 'all', label: language === 'bn' ? 'সব' : 'All', icon: Filter },
                                    { value: '5star', label: '5', icon: Star },
                                    { value: '4star', label: '4', icon: Star },
                                    { value: 'recent', label: language === 'bn' ? 'সাম্প্রতিক' : 'Recent', icon: TrendingUp }
                                ].map(({ value, label, icon: Icon }) => (
                                    <button
                                        key={value}
                                        onClick={() => setFilter(value)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-sm transition-colors ${filter === value
                                            ? 'bg-maroon text-white'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                            }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    {loading ? (
                        <div className="grid grid-cols-1 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <ReviewCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm"
                                >
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <Link
                                            to={`/product/${review.product.slug || review.product._id}`}
                                            className="flex-shrink-0"
                                        >
                                            <img
                                                src={review.product.image}
                                                alt={review.product.name}
                                                className="w-full md:w-20 h-40 md:h-20 object-cover rounded-xl"
                                            />
                                        </Link>

                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                                                <div>
                                                    <Link
                                                        to={`/product/${review.product.slug || review.product._id}`}
                                                        className="font-bold text-slate-800 dark:text-white hover:text-maroon transition-colors text-sm"
                                                    >
                                                        {review.product.name}
                                                    </Link>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-slate-500 font-semibold text-xs">
                                                            {review.user?.name || review.guestName || 'Valued Guest'}
                                                        </span>
                                                        {review.isVerifiedPurchase && (
                                                            <span className="flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                                <Award className="w-3 h-3" />
                                                                Verified
                                                            </span>
                                                        )}
                                                        <span className="text-slate-300 text-xs">•</span>
                                                        <span className="text-slate-400 text-xs">{formatDate(review.createdAt)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((star) => {
                                                        const isFull = review.rating >= star;
                                                        const isHalf = !isFull && review.rating >= (star - 0.5);
                                                        return (
                                                            <div key={star} className="relative w-4 h-4">
                                                                <Star className="w-4 h-4 text-slate-300" />
                                                                {isHalf && (
                                                                    <Star
                                                                        className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0"
                                                                        style={{ clipPath: 'inset(0 50% 0 0)' }}
                                                                    />
                                                                )}
                                                                {isFull && (
                                                                    <Star
                                                                        className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0"
                                                                    />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                                                {review.comment}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs">
                                                <button className="flex items-center gap-1.5 text-slate-400 hover:text-maroon transition-colors">
                                                    <ThumbsUp className="w-3.5 h-3.5" />
                                                    <span>{language === 'bn' ? 'সহায়ক' : 'Helpful'} ({review.helpful})</span>
                                                </button>
                                                <button className="flex items-center gap-1.5 text-slate-400 hover:text-maroon transition-colors">
                                                    <MessageCircle className="w-3.5 h-3.5" />
                                                    <span>{language === 'bn' ? 'উত্তর দিন' : 'Reply'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Load More */}
                    {!loading && reviews.length > 0 && (
                        <div className="text-center mt-8">
                            <button className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                {language === 'bn' ? 'আরো দেখুন' : 'Load More Reviews'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Form Modal */}
            {showReviewForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={handleReviewFormClose} />
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-elevated w-full max-w-lg max-h-[85vh] overflow-y-auto border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                {selectedProductId
                                    ? (language === 'bn' ? 'রিভিউ লিখুন' : 'Write a Review')
                                    : (language === 'bn' ? 'পণ্য নির্বাচন করুন' : 'Select a Product')
                                }
                            </h2>
                            <button
                                onClick={handleReviewFormClose}
                                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-5">
                            {!selectedProductId ? (
                                productsLoading ? (
                                    <div className="space-y-3">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
                                                <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : products.length === 0 ? (
                                    <p className="text-center text-slate-500 text-sm py-8">
                                        {language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}
                                    </p>
                                ) : (
                                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                        {products.map((product) => (
                                            <button
                                                key={product._id}
                                                onClick={() => handleSelectProduct(product._id)}
                                                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-14 h-14 object-cover rounded-xl shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-slate-500 text-xs">
                                                        {product.price ? `৳${product.price}` : ''}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )
                            ) : (
                                <ReviewForm
                                    productId={selectedProductId}
                                    onSubmitted={handleReviewSubmitted}
                                    onClose={handleReviewFormClose}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Reviews;
