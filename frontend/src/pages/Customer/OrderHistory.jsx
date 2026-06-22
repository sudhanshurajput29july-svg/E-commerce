import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Calendar, IndianRupee, Award } from 'lucide-react';
import api, { getImageUrl } from '../../services/api.js';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/myorders');
        setOrders(res.data);
      } catch (error) {
        console.error('Error fetching order history:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        <div className="h-6 bg-slate-200 rounded w-1/4 animate-pulse dark:bg-slate-800"></div>
        <div className="h-40 bg-slate-100 rounded-2xl animate-pulse dark:bg-slate-800"></div>
        <div className="h-40 bg-slate-100 rounded-2xl animate-pulse dark:bg-slate-800"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto dark:bg-slate-800">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-850 dark:text-white">No Orders Found</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          You haven't placed any orders yet. Head to our store to make your first purchase!
        </p>
        <Link
          to="/shop"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition inline-block shadow-sm"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Order History</h1>
        <p className="text-xs text-slate-400">Review your past purchases and check shipment tracking status</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl border border-slate-100 p-6 dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs space-y-4"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between border-b border-slate-100 pb-4 dark:border-slate-700 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Order ID</span>
                <span className="font-bold text-xs text-slate-700 dark:text-slate-300">#{order._id}</span>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  order.isPaid
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                }`}>
                  {order.isPaid ? 'Paid' : 'Payment Pending'}
                </span>
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-3 py-2 border-b border-slate-100 dark:border-slate-700">
              {order.orderItems.map((item) => (
                <div key={item._id || item.product} className="flex items-center space-x-3 text-xs">
                  <img 
                    src={getImageUrl(item.image)} 
                    alt={item.name} 
                    className="w-12 h-12 object-cover rounded-xl border border-slate-150 dark:border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-750 dark:text-slate-200 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Qty: {item.quantity} • Price: ₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Content summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-6 text-xs text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="dark:text-slate-300">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <IndianRupee className="h-4 w-4 text-slate-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{order.totalPrice.toFixed(2)}</span>
                </div>
                <div>
                  <span className="dark:text-slate-400">{order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} item(s)</span>
                </div>
              </div>

              <Link
                to={`/order/${order._id}`}
                className="flex items-center bg-slate-50 border border-slate-250 text-slate-700 font-semibold text-2xs px-4 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition dark:bg-slate-900 dark:border-slate-750 dark:text-slate-300 dark:hover:text-white"
              >
                <Eye className="h-3.5 w-3.5 mr-1.5" /> View Order Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
