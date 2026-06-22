import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlistItems: []
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.wishlistItems = action.payload.products || [];
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
    }
  }
});

export const { setWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
