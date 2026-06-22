import React, { useState, useEffect } from 'react';
import { ShoppingCart, Edit, Calendar, Info, RefreshCw } from 'lucide-react';
import api, { getImageUrl } from '../../services/api.js';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin orders:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleDateChange = async (orderId, dateField, newDate) => {
    try {
      await api.put(`/orders/${orderId}/status`, { [dateField]: newDate || '' });
      toast.success(`${dateField.replace('At', '')} date updated successfully`);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update date');
    }
  };

  const getStatusStyle = (status) => {
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

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-5 mb-5 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Customer Orders</h2>
        <p className="text-xs text-slate-400">Review shopping checkout records and modify tracking/shipping steps</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading checkout orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No customer orders recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider dark:bg-slate-900/50 dark:border-slate-700">
                  <th className="p-4">Order Details</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Purchase Date</th>
                  <th className="p-4">Total Fee</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-center">Tracking Status</th>
                  <th className="p-4">Timeline Dates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition">
                    <td className="p-4">
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {order.orderItems.map((item) => (
                          <div key={item._id} className="group relative h-9 w-9 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-905 flex-shrink-0 border border-slate-100 dark:border-slate-700/60 shadow-2xs">
                            <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 mb-1 font-semibold dark:bg-slate-700">
                              {item.quantity}x {item.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      <span className="font-bold text-slate-800 block dark:text-slate-100">#{order._id.substring(18)}...</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-750 dark:text-slate-300">{order.user?.name || 'Deleted User'}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">₹{order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.isPaid
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                      }`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                      <span className="text-3xs text-slate-400 block mt-1 uppercase font-semibold">{order.paymentMethod}</span>
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none dark:bg-slate-900 dark:border-slate-700 ${getStatusStyle(order.orderStatus)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 min-w-[200px]">
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-2 dark:bg-slate-900/40 dark:border-slate-700/60 shadow-2xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 font-semibold uppercase">Processing:</span>
                          <input
                            type="date"
                            value={order.processingAt ? order.processingAt.substring(0, 10) : ''}
                            onChange={(e) => handleDateChange(order._id, 'processingAt', e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-1.5 py-0.5 text-[10px] text-slate-700 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 font-semibold uppercase">Shipped:</span>
                          <input
                            type="date"
                            value={order.shippedAt ? order.shippedAt.substring(0, 10) : ''}
                            onChange={(e) => handleDateChange(order._id, 'shippedAt', e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-1.5 py-0.5 text-[10px] text-slate-700 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 font-semibold uppercase">Delivered:</span>
                          <input
                            type="date"
                            value={order.deliveredAt ? order.deliveredAt.substring(0, 10) : ''}
                            onChange={(e) => handleDateChange(order._id, 'deliveredAt', e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-1.5 py-0.5 text-[10px] text-slate-700 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 font-semibold uppercase">Cancelled:</span>
                          <input
                            type="date"
                            value={order.cancelledAt ? order.cancelledAt.substring(0, 10) : ''}
                            onChange={(e) => handleDateChange(order._id, 'cancelledAt', e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-1.5 py-0.5 text-[10px] text-slate-700 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
