import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Heart, Star, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import api, { getImageUrl } from '../../services/api.js';
import { setCart } from '../../redux/cartSlice.js';
import { setWishlist } from '../../redux/wishlistSlice.js';
import ReviewSection from '../../components/Customer/ReviewSection.jsx';
import ProductCard from '../../components/Customer/ProductCard.jsx';
import { SkeletonDetail } from '../../components/Common/Skeleton.jsx';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  const fetchProductDetails = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
      setActiveImage(res.data.images[0] || '/uploads/placeholder.png');
      
      const relatedRes = await api.get(`/products/${id}/related`);
      setRelated(relatedRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading product details:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProductDetails();
    setQuantity(1);
  }, [id]);

  const isWishlisted = wishlistItems.some((item) => item._id === product?._id);

  const handleToggleWishlist = async () => {
    if (!userInfo) {
      toast.warning('Please log in to update your wishlist');
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

  const handleAddToCart = async () => {
    if (!userInfo) {
      toast.warning('Please log in to add items to cart');
      return navigate(`/login?redirect=${encodeURIComponent(`/product/${id}`)}`);
    }

    if (product.stockQuantity < quantity) {
      return toast.error('Requested quantity exceeds available stock');
    }

    try {
      const res = await api.post('/cart', { productId: product._id, quantity });
      dispatch(setCart(res.data));
      toast.success('Items added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding to cart');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SkeletonDetail />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Product Not Found</h2>
        <Link to="/shop" className="text-indigo-600 hover:underline mt-4 inline-block text-sm">Return to Shop</Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back button */}
      <div>
        <Link to="/shop" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition dark:text-slate-400 dark:hover:text-indigo-400">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Catalog
        </Link>
      </div>

      {/* Main product columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left: Images Column */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden aspect-square dark:bg-slate-800 dark:border-slate-700/60">
            <img
              src={getImageUrl(activeImage)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-1">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    activeImage === img ? 'border-indigo-600' : 'border-transparent hover:border-slate-200'
                  }`}
                >
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-3xs uppercase font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400">{product.brand}</span>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white leading-tight">{product.name}</h1>
            
            {/* Rating Stars summary */}
            <div className="flex items-center space-x-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.ratings) ? 'fill-current' : 'text-slate-200 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{product.ratings.toFixed(1)} ratings</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-xs text-slate-400">{product.numReviews} buyer reviews</span>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Price details */}
          <div className="flex items-baseline space-x-3">
            {hasDiscount ? (
              <>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₹{product.discountPrice.toFixed(2)}</span>
                <span className="text-sm text-slate-400 line-through">₹{product.price.toFixed(2)}</span>
                <span className="bg-red-50 text-red-600 font-bold text-2xs px-2 py-0.5 rounded-md dark:bg-red-950/20">
                  Save ₹{(product.price - product.discountPrice).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₹{product.price.toFixed(2)}</span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">About this product</h4>
            <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-300">{product.description}</p>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Stock availability */}
          <div className="flex items-center space-x-2">
            {product.stockQuantity > 0 ? (
              <>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  In Stock - {product.stockQuantity} units available
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                <span className="text-xs font-semibold text-rose-600">Temporary Out of Stock</span>
              </>
            )}
          </div>

          {/* Add to Cart Actions */}
          {product.stockQuantity > 0 && (
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-slate-800 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="px-3 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition flex items-center justify-center space-x-2 flex-grow sm:flex-initial"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Shopping Cart</span>
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`p-3 rounded-xl border transition ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-100 text-rose-500'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-rose-500 dark:bg-slate-900 dark:border-slate-700'
                }`}
                title="Save to wishlist"
              >
                <Heart className="h-4.5 w-4.5 fill-current" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Reviews section */}
      <ReviewSection productId={id} onReviewAdded={fetchProductDetails} />

      {/* Related Products Grid list */}
      {related.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
