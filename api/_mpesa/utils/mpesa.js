import axios from 'axios';
import mpesaConfig from '../config/mpesa.js';

class MpesaUtils {
  
  // Initiate STK Push
  async initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc) {
    try {
      const accessToken = await mpesaConfig.generateAccessToken();
      const timestamp = mpesaConfig.generateTimestamp();
      const password = mpesaConfig.generatePassword(timestamp);
      const formattedPhone = mpesaConfig.formatPhoneNumber(phoneNumber);

      // For Paybill, BusinessShortCode is the paybill number
      // PartyB should be the till number (or same as BusinessShortCode if no till)
      const requestData = {
        BusinessShortCode: mpesaConfig.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerBuyGoodsOnline',
        Amount: Math.floor(amount), // Ensure amount is integer
        PartyA: formattedPhone,
        PartyB: 4996810,
        PhoneNumber: formattedPhone,
        CallBackURL: mpesaConfig.callbackUrl,
        AccountReference: accountReference || 'Account Payment',
        TransactionDesc: transactionDesc || 'Payment'
      };
      
      const response = await axios.post(mpesaConfig.stkPushUrl, requestData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if STK Push was actually sent
      if (response.data.ResponseCode === '0') {
        console.log('📱 STK Push should appear on phone:', formattedPhone);
      } else {
        console.log('⚠️  STK Push request issue:');
        console.log('  - Response Code:', response.data.ResponseCode);
        console.log('  - Response Description:', response.data.ResponseDescription);
      }

      return {
        success: true,
        data: response.data,
        checkoutRequestId: response.data.CheckoutRequestID
      };

    } catch (error) {
      console.error('STK Push Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || { message: error.message }
      };
    }
  }

  // Query STK Push status
  async querySTKPushStatus(checkoutRequestId) {
    try {
      const accessToken = await mpesaConfig.generateAccessToken();
      const timestamp = mpesaConfig.generateTimestamp();
      const password = mpesaConfig.generatePassword(timestamp);

      const requestData = {
        BusinessShortCode: mpesaConfig.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await axios.post(mpesaConfig.stkQueryUrl, requestData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('STK Query Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || { message: error.message }
      };
    }
  }

  // Process M-Pesa callback
  processCallback(callbackData) {
    try {
      const { Body } = callbackData;
      
      if (!Body || !Body.stkCallback) {
        throw new Error('Invalid callback structure');
      }

      const callback = Body.stkCallback;
      const resultCode = callback.ResultCode;
      const resultDesc = callback.ResultDesc;
      const checkoutRequestId = callback.CheckoutRequestID;
      const merchantRequestId = callback.MerchantRequestID;

      // Extract callback metadata if payment was successful
      let callbackMetadata = null;
      if (resultCode === 0 && callback.CallbackMetadata) {
        const metadata = callback.CallbackMetadata.Item || [];
        callbackMetadata = {};
        
        metadata.forEach(item => {
          switch (item.Name) {
            case 'Amount':
              callbackMetadata.amount = item.Value;
              break;
            case 'MpesaReceiptNumber':
              callbackMetadata.mpesaReceiptNumber = item.Value;
              break;
            case 'TransactionDate':
              callbackMetadata.transactionDate = item.Value;
              break;
            case 'PhoneNumber':
              callbackMetadata.phoneNumber = item.Value;
              break;
          }
        });
      }

      return {
        success: resultCode === 0,
        resultCode,
        resultDesc,
        checkoutRequestId,
        merchantRequestId,
        callbackMetadata
      };

    } catch (error) {
      console.error('Callback processing error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Validate amount
  validateAmount(amount) {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Amount must be a positive number');
    }
    
    if (numAmount < 1) {
      throw new Error('Minimum amount is KSh 1');
    }
    
    if (numAmount > 150000) {
      throw new Error('Maximum amount is KSh 150,000');
    }
    
    return Math.floor(numAmount);
  }

  // Format amount for display
  formatAmount(amount) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Convert USD to KES (approximate rate, should be updated regularly)
  convertUSDToKES(usdAmount, exchangeRate = 1) {
    return Math.floor(usdAmount * exchangeRate);
  }
}

export default new MpesaUtils();