import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ClipboardList, MapPin, CreditCard, ChevronRight, CheckCircle, PackageOpen, Award, ArrowLeft, Calendar, Info } from 'lucide-react';
import api from '../../services/api.js';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error('Error fetching order details:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = order ? steps.indexOf(order.orderStatus) : -1;

  const getStepDate = (step) => {
    if (!order) return null;
    switch (step) {
      case 'Pending':
        return order.createdAt ? new Date(order.createdAt).toLocaleDateString() : null;
      case 'Processing':
        return order.processingAt ? new Date(order.processingAt).toLocaleDateString() : null;
      case 'Shipped':
        return order.shippedAt ? new Date(order.shippedAt).toLocaleDateString() : null;
      case 'Delivered':
        return order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : null;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        <div className="h-6 bg-slate-200 rounded w-1/4 animate-pulse dark:bg-slate-800"></div>
        <div className="h-60 bg-slate-100 rounded-3xl animate-pulse dark:bg-slate-800"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Order Not Found</h2>
        <Link to="/orders" className="text-indigo-600 hover:underline text-xs">Back to My Orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link to="/orders" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition dark:text-slate-400 dark:hover:text-indigo-400">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to My Orders
        </Link>
      </div>

      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-850 dark:text-white">Order Details</h1>
          <p className="text-xs text-slate-400 mt-1">Placed on {new Date(order.createdAt).toLocaleString()} | ID: #{order._id}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
            order.orderStatus === 'Delivered'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
              : order.orderStatus === 'Cancelled'
              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
              : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400'
          }`}>
            Shipment: {order.orderStatus}
          </span>
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
            order.isPaid
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
          }`}>
            Payment: {order.isPaid ? 'Paid' : 'Unpaid'}
          </span>
        </div>
      </div>

      {/* Progress Roadmap Tracker */}
      {order.orderStatus !== 'Cancelled' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs">
          <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 mb-6">Delivery Progress</h3>
          <div className="flex items-center justify-between relative">
            {/* Background line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-700 z-0"></div>
            
            {/* Active connection line */}
            {currentStepIndex > 0 && (
              <div 
                className="absolute top-4 left-4 h-0.5 bg-indigo-600 z-0 transition-all duration-300"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              ></div>
            )}

            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isActive = idx === currentStepIndex;
              const stepDate = getStepDate(step);

              return (
                <div key={step} className="flex flex-col items-center z-10">
                  <div className={`h-8.5 w-8.5 rounded-full flex items-center justify-center font-bold text-xs border-2 transition ${
                    isCompleted
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-[10px] font-bold mt-2 ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : isCompleted ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'
                  }`}>{step}</span>
                  {stepDate && (
                    <span className="text-[9px] text-slate-400 mt-1">{stepDate}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cancelled Banner */}
      {order.orderStatus === 'Cancelled' && (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 dark:bg-rose-950/10 dark:border-rose-900/30 flex items-center space-x-3 text-xs font-bold text-rose-700 dark:text-rose-450 shadow-2xs">
          <Info className="h-5 w-5 flex-shrink-0" />
          <span>This order was Cancelled {order.cancelledAt && `on ${new Date(order.cancelledAt).toLocaleDateString()}`}. Any payment holds will be refunded.</span>
        </div>
      )}

      {/* Information grid: Shipping address vs Payment options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Shipping Address */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs space-y-3">
          <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center border-b border-slate-100 pb-2 dark:border-slate-700">
            <MapPin className="h-4.5 w-4.5 mr-2 text-indigo-600" /> Delivery Address
          </h3>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-bold text-slate-800 dark:text-white">{order.user.name}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p className="pt-2 font-medium text-slate-700 dark:text-slate-400">Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Right: Payment details */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs space-y-3">
          <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center border-b border-slate-100 pb-2 dark:border-slate-700">
            <CreditCard className="h-4.5 w-4.5 mr-2 text-indigo-600" /> Payment Summary
          </h3>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-semibold text-slate-800 dark:text-white">Method: <span className="font-bold">{order.paymentMethod}</span></p>
            {order.isPaid ? (
              <>
                <p className="text-emerald-600 font-bold">Paid on {new Date(order.paidAt).toLocaleString()}</p>
                <p className="text-3xs text-slate-400 font-mono pt-1">Transaction: {order.paymentResult?.id}</p>
              </>
            ) : (
              <p className="text-amber-600 font-bold">Payment Pending</p>
            )}
          </div>
        </div>
      </div>

      {/* Itemized list of products */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs space-y-4">
        <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 border-b border-slate-100 pb-2 dark:border-slate-700">Items Ordered</h3>

        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center text-xs gap-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-lg bg-slate-50 overflow-hidden flex-shrink-0 dark:bg-slate-900">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <Link to={`/product/${item.product}`} className="font-bold text-slate-800 hover:text-indigo-600 transition dark:text-slate-100 dark:hover:text-indigo-400">{item.name}</Link>
                  <span className="text-3xs text-slate-400 block mt-0.5">₹{item.price.toFixed(2)} x {item.quantity}</span>
                </div>
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <hr className="border-slate-100 dark:border-slate-700" />

        <div className="space-y-2 text-xs text-slate-500 max-w-xs ml-auto pr-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-800 dark:text-slate-250">₹{order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-semibold text-slate-800 dark:text-slate-255">₹{order.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span className="font-semibold text-slate-800 dark:text-slate-255">₹{order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-bold text-slate-800 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-700">
            <span>Order Total</span>
            <span className="text-base text-indigo-600 dark:text-indigo-400">₹{order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OrderDetails;
