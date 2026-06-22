import { createSlice } from '@reduxjs/toolkit';

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
  ? JSON.parse(localStorage.getItem('paymentMethod'))
  : 'COD';

const initialState = {
  cartItems: [],
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: paymentMethodFromStorage,
  itemsPrice: '0.00',
  shippingPrice: '0.00',
  taxPrice: '0.00',
  totalPrice: '0.00'
};

const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const calculateTotals = (state) => {
  // Calculate items price (use discountPrice if available)
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => {
      const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
      return acc + price * item.quantity;
    }, 0)
  );

  // Shipping charges: free over ₹100, else ₹10
  state.shippingPrice = addDecimals(state.itemsPrice > 100 || state.itemsPrice === '0.00' ? 0 : 10);

  // Tax calculation: 18% GST/sales tax
  state.taxPrice = addDecimals(Number((0.18 * state.itemsPrice).toFixed(2)));

  // Total price
  state.totalPrice = addDecimals(
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  );
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cartItems = action.payload.items || [];
      calculateTotals(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      state.itemsPrice = '0.00';
      state.shippingPrice = '0.00';
      state.taxPrice = '0.00';
      state.totalPrice = '0.00';
    }
  }
});

export const {
  setCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems
} = cartSlice.actions;

export default cartSlice.reducer;
