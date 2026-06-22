import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones, RotateCcw, ArrowRight } from 'lucide-react';
import api from '../../services/api.js';
import ProductCard from '../../components/Customer/ProductCard.jsx';
import { SkeletonCard } from '../../components/Common/Skeleton.jsx';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products');
        // Filter featured products client side or backend
        const featured = res.data.products.filter(p => p.featured).slice(0, 4);
        setFeaturedProducts(featured);
        setLoading(false);
      } catch (error) {
        console.error('Error loading home products:', error.message);
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Electronics', slug: 'electronics', desc: 'Laptops, Smart Watches & more', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { name: 'Fashion', slug: 'fashion', desc: 'Premium clothing & footwear', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', desc: 'Ergonomic decor & appliances', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { name: 'Beauty & Health', slug: 'beauty-health', desc: 'Organic cosmetics & serums', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 px-6 sm:px-12 rounded-b-[40px] shadow-lg">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="bg-indigo-500/20 text-indigo-300 font-extrabold text-2xs uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-500/30">
              Exclusive Summer Launch
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Upgrade Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Digital Lifestyle</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
              Explore our curation of premium headphones, cutting-edge smartwatches, ergonomic design chairs, and high-performance essentials. Free shipping on orders over ₹100.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/shop"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-6 py-3 rounded-full transition shadow-md shadow-indigo-600/20 flex items-center"
              >
                Shop Catalogue <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link
                to="/shop?sort=newest"
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-sm px-6 py-3 rounded-full transition"
              >
                New Arrivals
              </Link>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
              alt="Hero Item"
              className="mx-auto rounded-3xl object-contain h-[380px] drop-shadow-[0_20px_50px_rgba(99,102,241,0.3)] animate-pulse-slow"
            />
          </div>
        </div>
      </section>

      {/* Support Features Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-slate-900 dark:text-indigo-400">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-white">Free Delivery</h4>
              <p className="text-[10px] text-slate-400">For all orders over ₹100</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-slate-900 dark:text-indigo-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-white">Secure Payment</h4>
              <p className="text-[10px] text-slate-400">100% encrypted checking</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-slate-900 dark:text-indigo-400">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-white">30 Days Return</h4>
              <p className="text-[10px] text-slate-400">Hassle-free exchanges</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-slate-900 dark:text-indigo-400">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-white">24/7 Support</h4>
              <p className="text-[10px] text-slate-400">Instant customer help desk</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Featured Products</h2>
            <p className="text-xs text-slate-400">Top-rated and recommended items just for you</p>
          </div>
          <Link to="/shop" className="text-xs font-bold text-indigo-600 hover:text-indigo-500 flex items-center transition dark:text-indigo-400">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          ) : featuredProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400">No featured products found.</div>
          ) : (
            featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Browse by Category</h2>
          <p className="text-xs text-slate-400">Find exactly what you are looking for in our collections</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.slug}`}
              className="group relative h-60 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition duration-300 block"
            >
              <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/50 transition duration-300 z-10"></div>
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-6 left-6 z-20 text-white space-y-1">
                <h3 className="font-extrabold text-lg">{cat.name}</h3>
                <p className="text-slate-200 text-3xs">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
