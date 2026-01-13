import { validationResult } from 'express-validator';
import mpesaUtils from '../utils/mpesa.js';
import db from '../../_config/database.js';

// Initiate M-Pesa payment for an order
export const initiatePayment = async (req, res) => {
  try {
    const { phoneNumber, amount, orderId, userId } = req.body;
    
    if (!phoneNumber || !amount || !orderId || !userId) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields (phoneNumber, amount, orderId, userId)'
        });
    }

    // Validate and convert amount
    const validatedAmount = mpesaUtils.validateAmount(amount);
    
    // Initiate STK push
    const result = await mpesaUtils.initiateSTKPush(
      phoneNumber,
      validatedAmount,
      `ORD-${orderId}`,
      `Order Payment #${orderId}`
    );

    if (result.success) {
      // Fetch order number and user name for easier display later
      const [[order]] = await db.query('SELECT order_number FROM orders WHERE id = ?', [orderId]);
      const [[user]] = await db.query('SELECT username FROM users WHERE id = ?', [userId]);
      
      const orderNumber = order ? order.order_number : `ORD-${orderId}`;
      const username = user ? user.username : 'Unknown';

      // Create record in pending_payments
      await db.query(
        `INSERT INTO pending_payments (
          order_id, order_number, username, checkout_request_id, merchant_request_id, amount, phone_number, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [orderId, orderNumber, username, result.checkoutRequestId, result.data.MerchantRequestID, validatedAmount, phoneNumber]
      );

      res.json({
        success: true,
        message: 'Payment initiated successfully',
        data: {
          checkoutRequestId: result.checkoutRequestId,
          amount: validatedAmount,
          orderId
        }
      });
    } else {
      throw new Error(result.error?.message || 'Failed to initiate payment');
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Payment processing failed' 
    });
  }
};

// Check STK Push status (Polling)
export const checkPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;

    if (!checkoutRequestId) {
      return res.status(400).json({
        success: false,
        error: 'Checkout Request ID is required'
      });
    }

    // Check status in database first (updated by callback)
    const [payments] = await db.query(
        'SELECT status, order_id FROM pending_payments WHERE checkout_request_id = ?',
        [checkoutRequestId]
    );

    if (payments.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Payment not found'
        });
    }

    const payment = payments[0];

    // If already completed or failed in DB, return that
    if (payment.status !== 'pending') {
        return res.json({
            success: true,
            status: payment.status,
            orderId: payment.order_id
        });
    }

    // Otherwise, query M-Pesa for real-time status
    const result = await mpesaUtils.querySTKPushStatus(checkoutRequestId);
    
    if (result.success) {
      // ResponseCode 0 means success
      // If result is ready, we might update here too as a fallback for missing callbacks
      if (result.data.ResultCode === '0') {
          // Success code
          // Note: Full processing happens in callback, but we can report success here
      }

      res.json({
        success: true,
        status: 'pending', // Still pending in our DB until callback or manual update
        mpesaData: result.data
      });
    } else {
      // M-Pesa might return error if request is too old or invalid
      res.json({
          success: false,
          status: 'error',
          error: result.error
      });
    }

  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check payment status' 
    });
  }
};

// Handle M-Pesa callback
export const handleCallback = async (req, res) => {
  try {
    const callbackData = mpesaUtils.processCallback(req.body);
    const { checkoutRequestId, success, callbackMetadata, resultDesc } = callbackData;

    console.log(`Callback received for ${checkoutRequestId}: Success=${success}`);

    if (checkoutRequestId) {
        // 1. Get the pending payment details
        const [payments] = await db.query(
            'SELECT order_id, order_number, username, phone_number, amount FROM pending_payments WHERE checkout_request_id = ?',
            [checkoutRequestId]
        );

        if (payments.length > 0) {
            const payment = payments[0];
            const status = success ? 'completed' : 'failed';

            // 2. Update pending_payments table
            await db.query(
                'UPDATE pending_payments SET status = ? WHERE checkout_request_id = ?',
                [status, checkoutRequestId]
            );

            if (success) {
                // 3. Create official transaction record
                await db.query(
                    `INSERT INTO transactions (
                        order_id, order_number, user_id, username, amount, mpesa_receipt, phone_number, status
                    ) SELECT ?, ?, user_id, ?, ?, ?, ?, 'completed' FROM orders WHERE id = ?`,
                    [payment.order_id, payment.order_number, payment.username, callbackMetadata.amount, callbackMetadata.mpesaReceiptNumber, callbackMetadata.phoneNumber, payment.order_id]
                );

                // 4. Update order status
                await db.query(
                    "UPDATE orders SET payment_status = 'Paid', status = 'Processing' WHERE id = ?",
                    [payment.order_id]
                );

                // 5. Update Loyalty Points (1 point = 50 KES)
                const amount = parseFloat(callbackMetadata.amount);
                const pointsEarned = Math.floor(amount / 50);

                await db.query(`
                    INSERT INTO user_points (user_id, username, points, total_spent, total_orders)
                    SELECT user_id, ?, ?, ?, 1 FROM orders WHERE id = ?
                    ON DUPLICATE KEY UPDATE 
                        username = ?,
                        points = points + ?,
                        total_spent = total_spent + ?,
                        total_orders = total_orders + 1
                `, [
                    payment.username, pointsEarned, amount, payment.order_id, 
                    payment.username, pointsEarned, amount
                ]);

                console.log(`⭐ Points updated for ${payment.username}: +${pointsEarned} points`);
            } else {
                // Update order to failed payment
                await db.query(
                    "UPDATE orders SET payment_status = 'Failed' WHERE id = ?",
                    [payment.order_id]
                );
            }
        }
    }
    
    // Always acknowledge receipt to M-Pesa
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
    
  } catch (error) {
    console.error('Callback processing error:', error);
    res.json({ ResultCode: 0, ResultDesc: 'Internal Error' });
  }
};
