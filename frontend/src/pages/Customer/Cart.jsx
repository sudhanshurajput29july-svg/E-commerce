import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '../../services/api.js';
import { setCart } from '../../redux/cartSlice.js';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(
    (state) => state.cart
  );

  const handleQtyChange = async (productId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;

    try {
      const res = await api.put('/cart', { productId, quantity: newQty });
      dispatch(setCart(res.data));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const res = await api.delete(`/cart/${productId}`);
      dispatch(setCart(res.data));
      toast.info('Item removed from cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error removing item');
    }
  };

  const handleCheckoutRedirect = () => {
    if (!userInfo) {
      toast.warning('Please sign in to proceed to checkout');
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto dark:bg-slate-800">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-850 dark:text-white">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Add some high-quality gadgets or fashion clothing to get started!
        </p>
        <Link
          to="/shop"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition inline-block shadow-sm"
        >
          Browse Shop Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: Cart Items Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs space-y-4">
          {cartItems.map((item) => {
            const product = item.product;
            if (!product) return null;

            const price = product.discountPrice > 0 ? product.discountPrice : product.price;

            return (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-150 last:border-b-0 last:pb-0 dark:border-slate-700 gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 dark:bg-slate-900">
                    <img
                      src={product.images?.[0] || '/uploads/placeholder.png'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Link to={`/product/${product._id}`} className="font-bold text-xs hover:text-indigo-600 transition text-slate-800 line-clamp-1 dark:text-slate-100 dark:hover:text-indigo-400">
                      {product.name}
                    </Link>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{product.brand}</span>
                    <span className="text-xs font-bold text-slate-750 dark:text-slate-200 mt-1 block">₹{price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                    <button
                      onClick={() => handleQtyChange(product._id, item.quantity, -1)}
                      className="px-2.5 py-1 text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-bold text-slate-800 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(product._id, item.quantity, 1)}
                      disabled={product.stockQuantity <= item.quantity}
                      className="px-2.5 py-1 text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove action */}
                  <button
                    onClick={() => handleRemoveItem(product._id)}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Pricing Box Summary */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Order Summary</h3>

          <div className="space-y-2.5 border-b border-slate-100 pb-4 dark:border-slate-700">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">₹{itemsPrice}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Shipping Fee</span>
              {Number(shippingPrice) === 0 ? (
                <span className="font-bold text-emerald-500 uppercase text-3xs">Free</span>
              ) : (
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{shippingPrice}</span>
              )}
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Tax (18% GST)</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">₹{taxPrice}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm font-bold text-slate-800 dark:text-white py-1">
            <span>Total Price</span>
            <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">₹{totalPrice}</span>
          </div>

          <button
            onClick={handleCheckoutRedirect}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-2xl text-xs transition flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
