import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import api, { getImageUrl } from '../../services/api.js';
import { setCart } from '../../redux/cartSlice.js';
import { setWishlist } from '../../redux/wishlistSlice.js';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.warning('Please log in to add items to wishlist');
      return navigate('/login');
    }

    try {
      const res = await api.post('/users/wishlist', { productId: product._id });
      dispatch(setWishlist(res.data));
      if (isWishlisted) {
        toast.info('Removed from wishlist');
      } else {
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating wishlist');
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.warning('Please log in to add items to cart');
      return navigate('/login');
    }

    if (product.stockQuantity < 1) {
      return toast.error('Out of stock');
    }

    try {
      const res = await api.post('/cart', { productId: product._id, quantity: 1 });
      dispatch(setCart(res.data));
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding to cart');
    }
  };

  // Determine pricing display
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const savingPercentage = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 dark:bg-slate-800 dark:border-slate-700/60 dark:hover:border-slate-600 flex flex-col h-full relative">
      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 p-2 rounded-full border border-slate-100/60 backdrop-blur-sm z-10 transition-all duration-150 ${
          isWishlisted
            ? 'bg-rose-50 border-rose-100 text-rose-500 hover:scale-105'
            : 'bg-white/80 text-slate-500 hover:text-rose-500 hover:scale-105 dark:bg-slate-900/80 dark:border-slate-800'
        }`}
      >
        <Heart className="h-4.5 w-4.5 fill-current" />
      </button>

      {/* Product Image Link */}
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden aspect-square">
        <img
          src={getImageUrl(product.images[0])}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <span className="absolute bottom-3 left-3 bg-red-500 text-white font-bold text-2xs px-2 py-0.5 rounded-md">
            Save {savingPercentage}%
          </span>
        )}
        {product.stockQuantity === 0 && (
          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
            <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1 rounded">Out of stock</span>
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-3xs uppercase font-extrabold tracking-wider text-indigo-500">{product.brand}</span>
        <Link to={`/product/${product._id}`} className="hover:text-indigo-600 transition">
          <h3 className="font-bold text-sm text-slate-800 line-clamp-2 mt-1 mb-2 dark:text-slate-100 dark:hover:text-indigo-400">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.round(product.ratings || 0) ? 'fill-current' : 'text-slate-200 dark:text-slate-700'
                }`}
              />
            ))}
          </div>
          <span className="text-3xs text-slate-400 font-semibold">({product.numReviews})</span>
        </div>

        {/* Pricing & Cart Action */}
        <div className="mt-auto flex justify-between items-center">
          <div className="flex flex-col">
            {hasDiscount ? (
              <div className="flex items-baseline space-x-1.5">
                <span className="text-base font-extrabold text-slate-900 dark:text-white">₹{product.discountPrice.toFixed(2)}</span>
                <span className="text-2xs text-slate-400 line-through">₹{product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-base font-extrabold text-slate-900 dark:text-white">₹{product.price.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className={`p-2 rounded-xl border border-indigo-100 text-indigo-600 transition flex items-center justify-center ${
              product.stockQuantity === 0
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:border-slate-700'
                : 'bg-indigo-50/50 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 dark:bg-slate-900 dark:border-indigo-900/30 dark:hover:bg-indigo-600'
            }`}
            title="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
