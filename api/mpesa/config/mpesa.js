import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class MpesaConfig {
  constructor() {
    this.environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.passkey = process.env.MPESA_PASSKEY;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.baseUrl = process.env.MPESA_BASE_URL;
    this.authUrl = process.env.MPESA_AUTH_URL;
    this.stkPushUrl = process.env.MPESA_STK_PUSH_URL;
    this.stkQueryUrl = process.env.MPESA_STK_QUERY_URL;
    this.callbackUrl = process.env.MPESA_CALLBACK_URL;
    
    // Validate required environment variables
    this.validateConfig();
  }

  validateConfig() {
    
    const requiredVars = [
      'MPESA_CONSUMER_KEY',
      'MPESA_CONSUMER_SECRET', 
      'MPESA_PASSKEY',
      'MPESA_SHORTCODE'
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);
    const placeholder = requiredVars.filter(varName => {
      const value = process.env[varName];
      return value && (value.includes('your_') || value.includes('_here') || value === 'your-passkey-here' || value === 'your_consumer_key_here' || value === 'your_consumer_secret_here');
    });
    
    requiredVars.forEach(varName => {
      const value = process.env[varName];
      if (!value) {
        console.log(`  ❌ ${varName}: MISSING`);
      } else if (placeholder.includes(varName)) {
        console.log(`  ⚠️  ${varName}: PLACEHOLDER VALUE (${value})`);
      } else {
      }
    });
    
    if (this.callbackUrl) {
      console.log(`  ⚠️  Callback URL: ${this.callbackUrl}`);
      if (!this.callbackUrl.startsWith('https://')) {
        console.log(`  ⚠️  Callback URL should use HTTPS: ${this.callbackUrl}`);
      }
      if (this.callbackUrl.includes('localhost') || this.callbackUrl.includes('127.0.0.1')) {
        console.log(`  ⚠️  Callback URL uses localhost - M-Pesa cannot reach this. Use ngrok or public URL.`);
      }
    }
    
    if (missing.length > 0) {
      console.log('❌ VALIDATION FAILED - Missing variables!');
      throw new Error(`Missing required M-Pesa configuration: ${missing.join(', ')}`);
    }
    
    if (placeholder.length > 0) {
      console.log('❌ VALIDATION FAILED - Placeholder values detected!');
      throw new Error(`M-Pesa configuration contains placeholder values. Please update: ${placeholder.join(', ')}`);
    }
    
    console.log('✅ M-Pesa configuration validated successfully');
    
  }

  // Generate M-Pesa access token
  async generateAccessToken() {
    
    try {
      // Validate credentials before making request
      if (!this.consumerKey || !this.consumerSecret) {
        throw new Error('Consumer key or secret is missing');
      }
      
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(this.authUrl, {
        headers: {
          'Authorization': `Basic ${auth}`
        },
        timeout: 30000 // 30 second timeout
      });
      
      return response.data.access_token;
      
    } catch (error) {
      console.log('❌ ACCESS TOKEN GENERATION FAILED!');
      
      if (error.response) {
        // HTTP error response from Safaricom
        console.log(`  - HTTP Status: ${error.response.status}`);
        console.log(`  - HTTP Status Text: ${error.response.statusText}`);
        console.log(`  - Response Headers:`, JSON.stringify(error.response.headers, null, 2));
        console.log(`  - Response Data:`, JSON.stringify(error.response.data, null, 2));
        
        if (error.response.status === 401) {
          throw new Error('Invalid M-Pesa credentials - check your Consumer Key and Secret');
        } else if (error.response.status === 400) {
          throw new Error('Bad request to M-Pesa API - check your request format');
        } else {
          throw new Error(`M-Pesa API error (${error.response.status}): ${error.response.data?.error_description || error.response.statusText}`);
        }
      } else if (error.request) {
        // Network error
        console.log('  - Network Error: Request was made but no response received');
        console.log(`  - Request Config:`, error.config);
        throw new Error('Network error - could not reach M-Pesa servers. Check your internet connection.');
      } else {
        // Other error
        console.log(`  - Error: ${error.message}`);
        console.log(`  - Stack: ${error.stack}`);
        throw new Error(`Failed to generate M-Pesa access token: ${error.message}`);
      }
    }
  }

  // Generate STK Push password
  generatePassword(timestamp) {
    const data = this.shortcode + this.passkey + timestamp;
    return Buffer.from(data).toString('base64');
  }

  // Generate timestamp in the required format
  generateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  // Format phone number to M-Pesa format (254XXXXXXXXX)
  formatPhoneNumber(phoneNumber) {
    // Remove any non-numeric characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Handle different phone number formats
    if (cleaned.startsWith('0')) {
      // Convert 0XXXXXXXXX to 254XXXXXXXXX
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      // Convert XXXXXXXXX to 254XXXXXXXXX
      cleaned = '254' + cleaned;
    } else if (!cleaned.startsWith('254')) {
      // Add 254 prefix if not present
      cleaned = '254' + cleaned;
    }

    // Validate the final format
    if (!/^254[0-9]{9}$/.test(cleaned)) {
      throw new Error('Invalid phone number format. Expected format: 254XXXXXXXXX');
    }

    return cleaned;
  }
}

export default new MpesaConfig();