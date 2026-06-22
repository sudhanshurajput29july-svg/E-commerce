import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CreditCard, Truck, MapPin, ShieldAlert, ArrowLeft } from 'lucide-react';
import api from '../../services/api.js';
import { clearCartItems } from '../../redux/cartSlice.js';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const userAddresses = userInfo?.addresses || [];
  const { cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(
    (state) => state.cart
  );

  // Address form fields
  const [recipientName, setRecipientName] = useState(shippingAddress.recipientName || userInfo?.name || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [phone, setPhone] = useState(shippingAddress.phone || '');

  // Payment field
  const [activePaymentMethod, setActivePaymentMethod] = useState(paymentMethod || 'COD');

  // Simulation state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!recipientName || !address || !city || !postalCode || !country || !phone) {
      return toast.error('Please enter recipient name and complete shipping address');
    }

    if (activePaymentMethod !== 'COD' && (!cardNumber || !cardExpiry || !cardCvv)) {
      return toast.error('Please enter payment card credentials');
    }

    setLoading(true);

    try {
      // Save details locally in LocalStorage
      localStorage.setItem(
        'shippingAddress',
        JSON.stringify({ address, city, postalCode, country, phone, recipientName })
      );

      // Structure order items array
      const orderItems = cartItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        image: item.product.images[0] || '/uploads/placeholder.png',
        price: item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price,
        product: item.product._id,
      }));

      const orderData = {
        orderItems,
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
          phone,
          recipientName,
          isGift: recipientName !== userInfo.name
        },
        paymentMethod: activePaymentMethod,
        itemsPrice: Number(itemsPrice),
        taxPrice: Number(taxPrice),
        shippingPrice: Number(shippingPrice),
        totalPrice: Number(totalPrice),
      };

      // 1. Create order
      const orderRes = await api.post('/orders', orderData);
      const createdOrder = orderRes.data;

      // 2. Perform payment simulation
      if (activePaymentMethod !== 'COD') {
        // Simulate a 2s server delay to process credit card payment
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Mock verification call on the backend
        const mockPayDetails = {
          id: `${activePaymentMethod}-TXN-${Date.now()}`,
          status: 'success',
          update_time: new Date().toISOString(),
          email_address: userInfo.email,
        };
        await api.put(`/orders/${createdOrder._id}/pay`, mockPayDetails);
      }

      // 3. Complete checkout
      await api.delete('/cart'); // Clear cart in backend
      dispatch(clearCartItems()); // Clear cart in Redux
      
      toast.success('Order placed successfully!');
      navigate(`/order/${createdOrder._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Shipping & Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns: Address & Payment */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address Box */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 dark:border-slate-700">
              <MapPin className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold text-sm text-slate-800 dark:text-slate-100">Shipping Details</h2>
            </div>

            {userAddresses.length > 0 && (
              <div className="space-y-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <span className="block text-2xs font-extrabold text-slate-400 uppercase tracking-wider">Select Saved Address</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {userAddresses.map((addr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setRecipientName(addr.recipientName || '');
                        setAddress(addr.addressLine || '');
                        setCity(addr.city || '');
                        setPostalCode(addr.postalCode || '');
                        setCountry(addr.country || '');
                        setPhone(addr.phone || '');
                      }}
                      className="border border-slate-200 hover:border-indigo-500 rounded-2xl p-3 text-left transition bg-slate-50/20 hover:bg-slate-50/50 dark:border-slate-700 dark:hover:border-indigo-400 dark:bg-slate-900/10 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          addr.addressType === 'Home' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/25 dark:text-indigo-400' :
                          addr.addressType === 'Work' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-400' :
                          'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400'
                        }`}>
                          {addr.addressType}
                        </span>
                        <p className="font-bold text-slate-700 dark:text-slate-200 mt-2 text-xs truncate">{addr.recipientName}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{addr.addressLine}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{addr.city}, {addr.postalCode}</p>
                      </div>
                      <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-extrabold mt-3 block hover:underline">Use Address</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setRecipientName('');
                      setAddress('');
                      setCity('');
                      setPostalCode('');
                      setCountry('');
                      setPhone('');
                    }}
                    className="border border-dashed border-slate-350 hover:border-indigo-500 rounded-2xl p-3 text-center transition bg-transparent hover:bg-slate-50/50 dark:border-slate-700 dark:hover:border-indigo-400 flex flex-col items-center justify-center space-y-1.5 min-h-[110px]"
                  >
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">New Address</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">Enter custom delivery details</span>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1 dark:text-slate-400">Recipient's Full Name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1 dark:text-slate-400">Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, Apt 4"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1 dark:text-slate-400">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1 dark:text-slate-400">Postal Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="10001"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1 dark:text-slate-400">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-3xs font-bold text-slate-550 uppercase mb-1 dark:text-slate-400">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector Box */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 dark:border-slate-700">
              <CreditCard className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold text-sm text-slate-800 dark:text-slate-100">Payment Option</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setActivePaymentMethod('COD')}
                className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  activePaymentMethod === 'COD'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700 dark:bg-indigo-950/20'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-350'
                }`}
              >
                <span className="font-extrabold text-xs">Cash on Delivery</span>
                <span className="text-[10px] text-slate-400">Pay cash at doorstep</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePaymentMethod('Stripe')}
                className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  activePaymentMethod === 'Stripe'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700 dark:bg-indigo-950/20'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-350'
                }`}
              >
                <span className="font-extrabold text-xs">Stripe Checkout</span>
                <span className="text-[10px] text-slate-400">Card payment simulation</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePaymentMethod('Razorpay')}
                className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  activePaymentMethod === 'Razorpay'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700 dark:bg-indigo-950/20'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-350'
                }`}
              >
                <span className="font-extrabold text-xs">Razorpay Portal</span>
                <span className="text-[10px] text-slate-400">UPI/Debit card simulator</span>
              </button>
            </div>

            {/* Credit Card Simulator form if not COD */}
            {activePaymentMethod !== 'COD' && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 dark:bg-slate-900 dark:border-slate-700 mt-4">
                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded uppercase dark:bg-slate-800 dark:text-indigo-400">Simulated Payment Gateway</span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-3">
                    <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4111 2222 3333 4444"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Expiration</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">CVV</label>
                    <input
                      type="password"
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      maxLength={3}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: Review items & pricing */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Review Items</h3>

            <div className="max-h-56 overflow-y-auto pr-1 space-y-3">
              {cartItems.map((item) => {
                const product = item.product;
                const price = product.discountPrice > 0 ? product.discountPrice : product.price;

                return (
                  <div key={item._id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold dark:bg-slate-900">{item.quantity}x</span>
                      <span className="font-semibold text-slate-700 truncate max-w-[140px] dark:text-slate-300">{product.name}</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">₹{(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <hr className="border-slate-100 dark:border-slate-700" />

            <div className="space-y-2 border-b border-slate-100 pb-4 dark:border-slate-700">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-slate-250">₹{itemsPrice}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-800 dark:text-slate-255">₹{shippingPrice}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Tax (18% GST)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-255">₹{taxPrice}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-slate-800 dark:text-white py-1">
              <span>Order Total</span>
              <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">₹{totalPrice}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-2xl text-xs transition flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>{loading ? 'Processing Order...' : 'Place Order Now'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
