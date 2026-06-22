import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, ShoppingCart, IndianRupee, TrendingUp, Sparkles } from 'lucide-react';
import api from '../../services/api.js';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/orders/admin/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-3xl border border-slate-150 animate-pulse dark:bg-slate-800 dark:border-slate-700"></div>
          ))}
        </div>
        <div className="h-64 bg-white rounded-3xl animate-pulse dark:bg-slate-800"></div>
      </div>
    );
  }

  const kpis = [
    { name: 'Total Revenue', value: `₹${stats?.totalRevenue.toFixed(2)}`, icon: IndianRupee, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { name: 'Orders Placed', value: stats?.totalOrders, icon: ShoppingCart, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
    { name: 'Catalog Products', value: stats?.totalProducts, icon: ShoppingBag, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
    { name: 'Customers Registered', value: stats?.totalUsers, icon: Users, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' },
  ];

  // Calculate total category sales sum for percentage bar
  const catSales = stats?.categorySales || {};
  const totalSalesVal = Object.values(catSales).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Sparkles className="h-4.5 w-4.5 animate-bounce" />
            <span className="text-3xs uppercase font-extrabold tracking-wider">NextShop Portal</span>
          </div>
          <h2 className="text-2xl font-extrabold">Management Overview</h2>
          <p className="text-xs text-slate-300 max-w-md">Track orders, adjust product listings, toggle categories, delete customer reviews, and monitor revenue stats.</p>
        </div>
      </div>

      {/* KPI Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.name}
            className="bg-white p-6 rounded-3xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{kpi.name}</span>
              <span className="text-xl font-extrabold text-slate-800 dark:text-white">{kpi.value}</span>
            </div>
            <div className={`p-3 rounded-2xl ${kpi.color}`}>
              <kpi.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Category Performance Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs space-y-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Revenue Distribution by Category</h3>
        </div>

        {Object.keys(catSales).length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">No category sales recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(catSales).map(([category, amount]) => {
              const pct = Math.round((amount / totalSalesVal) * 100);
              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-750 dark:text-slate-200">{category}</span>
                    <span className="font-extrabold text-slate-800 dark:text-white">₹{amount.toFixed(2)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full dark:bg-slate-900 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
