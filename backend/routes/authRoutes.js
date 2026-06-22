import express from 'express';
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  logout
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/changepassword', protect, changePassword);
router.post('/logout', logout);

export default router;
