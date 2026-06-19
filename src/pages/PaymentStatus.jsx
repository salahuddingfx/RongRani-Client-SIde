import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, PartyPopper, Truck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import confetti from 'canvas-confetti';
import ThankYouCard from '../components/ThankYouCard';

const PaymentStatus = () => {
    const { status, orderId } = useParams();
    const { clearCart } = useCart();

    useEffect(() => {
        if (status === 'success') {
            clearCart();
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        }
    }, [status, clearCart]);

    const isSuccess = status === 'success';
    const isFailed = status === 'fail';
    const isCancelled = status === 'cancel';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center py-8 px-4">
            <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className={`h-1.5 ${isSuccess ? 'bg-green-500' : isFailed ? 'bg-red-500' : 'bg-amber-500'}`} />

                <div className="p-8 sm:p-10 text-center">
                    {isSuccess && (
                        <div className="space-y-5">
                            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                                    Order Confirmed! <PartyPopper className="h-5 w-5" />
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    Your payment was successful and your order is being prepared with love.
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-100 dark:border-slate-600 text-left space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Status</span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">Paid & Confirmed</span>
                                </div>
                                {orderId && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 dark:text-slate-400">Order ID</span>
                                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">#{orderId.slice(-8).toUpperCase()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                <ThankYouCard
                                    customerName="Valued Guest"
                                    discountAmount="10% OFF"
                                    couponCode="RONGRANI-LOVE"
                                    expiryDate="Next Purchase"
                                />
                            </div>
                        </div>
                    )}

                    {isFailed && (
                        <div className="space-y-5">
                            <XCircle className="mx-auto h-16 w-16 text-red-500" />
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Failed</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    We couldn't process your payment. Don't worry, your cart is safe. Please try again.
                                </p>
                            </div>
                        </div>
                    )}

                    {isCancelled && (
                        <div className="space-y-5">
                            <AlertTriangle className="mx-auto h-16 w-16 text-amber-500" />
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Cancelled</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    You've cancelled the payment. Whenever you're ready, you can complete it from your account.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        {isSuccess && (
                            <Link
                                to="/my-orders"
                                className="flex-1 bg-maroon text-white font-semibold py-3 px-5 rounded-xl hover:bg-maroon/90 transition-colors text-center text-sm"
                            >
                                Track Your Order <Truck className="inline-block w-4 h-4 ml-1" />
                            </Link>
                        )}
                        {!isSuccess && (
                            <Link
                                to="/checkout"
                                className="flex-1 bg-maroon text-white font-semibold py-3 px-5 rounded-xl hover:bg-maroon/90 transition-colors text-center text-sm"
                            >
                                Try Again
                            </Link>
                        )}
                        <Link
                            to="/"
                            className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white font-semibold py-3 px-5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-center text-sm"
                        >
                            Back to Home
                        </Link>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-400">
                            Need help? <a href="mailto:info.rongrani@gmail.com" className="text-maroon font-semibold hover:underline">Contact Support</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentStatus;
