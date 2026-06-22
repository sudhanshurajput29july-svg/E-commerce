import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import ProductCard from '../../components/Customer/ProductCard.jsx';

const Wishlist = () => {
  const { wishlistItems } = useSelector((state) => state.wishlist);

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto dark:bg-slate-800">
          <Heart className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-850 dark:text-white">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Start exploring products and click the heart icon on your favorite items to save them here!
        </p>
        <Link
          to="/shop"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition inline-block shadow-sm"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">My Wishlist</h1>
        <p className="text-xs text-slate-400">Manage and shop your saved items ({wishlistItems.length})</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
