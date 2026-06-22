import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Intro */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <ShoppingBag className="h-6 w-6 text-indigo-400" />
              <span className="font-bold text-xl tracking-tight">NextShop</span>
            </div>
            <p className="text-sm text-slate-400">
              Your ultimate destination for premium tech, classic fashion, home essentials, and natural beauty. Built with love and state-of-the-art tech.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/shop?category=electronics" className="hover:text-white transition">Electronics</a></li>
              <li><a href="/shop?category=fashion" className="hover:text-white transition">Fashion</a></li>
              <li><a href="/shop?category=home-kitchen" className="hover:text-white transition">Home & Kitchen</a></li>
              <li><a href="/shop?category=beauty-health" className="hover:text-white transition">Beauty & Health</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Track Your Order</a></li>
              <li><a href="#" className="hover:text-white transition">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm text-slate-400">
              Subscribe to get notified about sales, special offers, and new arrivals!
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full px-4 py-2 text-sm bg-slate-800 text-slate-100 border border-slate-700 rounded-l-lg focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-r-lg transition flex items-center justify-center"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500 flex flex-col sm:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} NextShop Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
