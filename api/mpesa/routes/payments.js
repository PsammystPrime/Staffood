import express from 'express';
import {
  initiatePayment,
  checkPaymentStatus,
  handleCallback
} from '../controllers/paymentController.js';

const router = express.Router();

// @route   POST /api/payments/initiate
// @desc    Initiate M-Pesa STK Push
// @access  Public
router.post('/initiate', initiatePayment);

// @route   GET /api/payments/status/:checkoutRequestId
// @desc    Check payment status (polled by frontend)
// @access  Public
router.get('/status/:checkoutRequestId', checkPaymentStatus);

// @route   POST /api/payments/callback
// @desc    Handle M-Pesa callback
// @access  Public (M-Pesa servers)
router.post('/callback', handleCallback);

export default router;