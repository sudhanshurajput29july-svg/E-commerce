import { createSlice } from '@reduxjs/toolkit';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    loginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutUser: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
    updateProfileSuccess: (state, action) => {
      const updatedInfo = { ...state.userInfo, ...action.payload };
      state.userInfo = updatedInfo;
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    }
  }
});

export const { loginStart, loginSuccess, loginFail, logoutUser, updateProfileSuccess } = authSlice.actions;
export default authSlice.reducer;
