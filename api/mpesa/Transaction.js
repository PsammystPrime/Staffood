import { proxyDB } from '../config/db.js';

class Transaction {
  constructor() {
    // No need for db initialization since we're using proxyDB
  }

  async create(transactionData) {
    try {
      // First verify user exists
      const userRows = await proxyDB(
        'SELECT id FROM users WHERE phone_number = ?',
        [transactionData.phoneNumber]
      );
      
      if (userRows.length === 0) {
        throw new Error(`User with phone ${transactionData.phoneNumber} not found`);
      }

      const userId = userRows[0].id;
      
      // Create transaction record
      const result = await proxyDB(
        `INSERT INTO transactions (
          user_id, 
          transaction_id, 
          transaction_type, 
          amount, 
          phone_number,
          account_reference,
          status,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          userId,
          transactionData.transactionId,
          transactionData.transactionType || 'payment',
          transactionData.amount,
          transactionData.phoneNumber,
          transactionData.accountReference || '',
          transactionData.status || 'pending'
        ]
      );

      return {
        id: result.insertId,
        userId,
        ...transactionData
      };
      
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async updateStatus(transactionId, status, resultCode = null, resultDesc = null) {
    try {
      const result = await proxyDB(
        `UPDATE transactions 
         SET status = ?, 
             result_code = ?,
             result_description = ?,
             updated_at = NOW()
         WHERE transaction_id = ?`,
        [status, resultCode, resultDesc, transactionId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Transaction not found');
      }

      return true;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  }

  async findByTransactionId(transactionId) {
    try {
      const transactions = await proxyDB(
        'SELECT * FROM transactions WHERE transaction_id = ?',
        [transactionId]
      );
      
      return transactions[0] || null;
    } catch (error) {
      console.error('Error finding transaction:', error);
      throw error;
    }
  }

  async findUserTransactions(userId, limit = 10) {
    try {
      return await proxyDB(
        `SELECT * FROM transactions 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT ?`,
        [userId, limit]
      );
    } catch (error) {
      console.error('Error finding user transactions:', error);
      throw error;
    }
  }
}

export default new Transaction();