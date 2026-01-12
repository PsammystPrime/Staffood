import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { proxyDB } from '../../config/db.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to store callback data
const CALLBACK_DATA_PATH = path.join(__dirname, '..', '..', 'callbackdata.json');
/**
 * Save M-Pesa callback data to a JSON file
 * @param {Object} callbackData - The callback data from M-Pesa
 * @returns {Promise<Object>} - Result of the operation
 */

async function saveCallbackData(callbackData) {
    try {
        let existingData = [];
        
        // Read existing data if file exists
        if (fs.existsSync(CALLBACK_DATA_PATH)) {
            const fileContent = fs.readFileSync(CALLBACK_DATA_PATH, 'utf8');
            if (fileContent) {
                existingData = JSON.parse(fileContent);
            }
        }
        
        // Add timestamp and new data
        const dataToSave = {
            timestamp: new Date().toISOString(),
            ...callbackData
        };
        
        // Add to existing data
        existingData.push(dataToSave);
        
        // Save back to file
        fs.writeFileSync(
            CALLBACK_DATA_PATH, 
            JSON.stringify(existingData, null, 2),
            'utf8'
        );
        
        return { 
            success: true, 
            message: 'Callback data saved successfully',
            data: dataToSave
        };
    } catch (error) {
        console.error('Error saving callback data:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
}

/**
 * Handle M-Pesa callback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleMpesaCallback(req, res) {
    
    try {
        const callbackData = req.body;
        
        // Save the raw callback data for reference
        await saveCallbackData(callbackData);
        
        // Check if this is a valid M-Pesa callback
        if (!callbackData.Body || !callbackData.Body.stkCallback) {
            console.log('Invalid callback format');
            return res.json({ ResultCode: 0, ResultDesc: 'Invalid callback format' });
        }
        
        const { 
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc,
            CallbackMetadata
        } = callbackData.Body.stkCallback;
        
        console.log(`Processing callback for CheckoutRequestID: ${CheckoutRequestID}, ResultCode: ${ResultCode}`);
        
        // Only process successful payments (ResultCode 0)
        if (ResultCode === 0) {
            try {
                // Extract payment details from callback metadata
                const metadata = {};
                if (CallbackMetadata && CallbackMetadata.Item) {
                    CallbackMetadata.Item.forEach(item => {
                        metadata[item.Name] = item.Value || null;
                    });
                }
                
                
                // Find the payment mapping for this checkout request
                const mapping = await proxyDB(
                    'SELECT * FROM payment_mappings WHERE checkout_request_id = ?',
                    [CheckoutRequestID]
                );
                
                if (!mapping || mapping.length === 0) {
                    console.error('No payment mapping found for CheckoutRequestID:', CheckoutRequestID);
                    return res.json({ ResultCode: 0, ResultDesc: 'No matching payment found' });
                }
                
                const { transaction_id, loan_id } = mapping[0];
                const mpesaReceipt = metadata.MpesaReceiptNumber;
                const amount = metadata.Amount;
                const phoneNumber = metadata.PhoneNumber ? `254${String(metadata.PhoneNumber).slice(-9)}` : null;
                
                try {
                    // 1. Update the transaction status to completed
                    await proxyDB(
                        `UPDATE transactions 
                         SET status = 'completed', 
                             mpesa_receipt = ?,
                             amount = ?,
                             updated_at = NOW() 
                         WHERE id = ?`,
                        [mpesaReceipt, amount, transaction_id]
                    );
                    
                    // 2. Update payment mapping status
                    await proxyDB(
                        'UPDATE payment_mappings SET status = ?, updated_at = NOW() WHERE checkout_request_id = ?',
                        ['completed', CheckoutRequestID]
                    );
                    
                    // 3. If there's a loan ID, update the loan balance and amount_paid
                    if (loan_id) {
                        // Get current loan details
                        const loan = await proxyDB(
                            'SELECT balance, amount_paid, status FROM loans WHERE id = ?',
                            [loan_id]
                        );

                        if (!loan || loan.length === 0) {
                            console.error(`Loan with ID ${loan_id} not found`);
                        } else {
                            const currentBalance = parseFloat(loan[0].balance);
                            const currentAmountPaid = parseFloat(loan[0].amount_paid || 0);
                            const newBalance = Math.max(0, currentBalance - amount);
                            const newAmountPaid = currentAmountPaid + amount;
                            const isFullyPaid = newBalance <= 0;
                            
                            // Update loan balance and amount_paid
                            await proxyDB(
                                `UPDATE loans 
                                 SET balance = ?, 
                                     amount_paid = ?,
                                     status = ?,
                                     updated_at = NOW() 
                                 WHERE id = ?`,
                                [
                                    isFullyPaid ? 0 : newBalance,
                                    newAmountPaid,
                                    isFullyPaid ? 'paid' : loan[0].status,
                                    loan_id
                                ]
                            );

                            console.log(`Payment of ${amount} for loan ${loan_id} processed with receipt ${mpesaReceipt}`);
                        }
                    }
                } catch (error) {
                    console.error('Error processing payment updates:', error);
                    // Continue to notifications even if updates fail
                }
                
                // Create notifications for the user and admin
                try {
                    const [[transaction], [loanDetails]] = await Promise.all([
                        proxyDB('SELECT user_id, amount FROM transactions WHERE id = ?', [transaction_id]),
                        loan_id ? proxyDB('SELECT user_id, amount, balance FROM loans WHERE id = ?', [loan_id]) : Promise.resolve([null])
                    ]);
                    
                    if (transaction && transaction.user_id) {
                        // User notification
                        const userMessage = loan_id && loanDetails[0]
                            ? `Your payment of KES ${amount.toLocaleString()} for loan ${loan_id} has been received. ` +
                              `M-Pesa Receipt: ${mpesaReceipt}. New balance: KES ${(loanDetails[0].balance - amount).toLocaleString()}`
                            : `Your payment of KES ${amount.toLocaleString()} has been received. M-Pesa Receipt: ${mpesaReceipt}`;
                        
                        await proxyDB(
                            `INSERT INTO notifications 
                             (user_id, title, message, type, created_at) 
                             VALUES (?, ?, ?, 'success', NOW())`,
                            [
                                transaction.user_id,
                                'Payment Received',
                                userMessage
                            ]
                        );

                        // Admin notification
                        const adminMessage = `Payment of KES ${amount.toLocaleString()} received from ${phoneNumber || 'user'}. ` +
                                          `Transaction: ${transaction_id}${loan_id ? `, Loan: ${loan_id}` : ''}`;
                        
                        // Get all admin users
                        const admins = await proxyDB('SELECT id FROM users WHERE is_admin = 1');
                        
                        // Create notifications for each admin if admins exist
                        if (admins && admins.length > 0) {
                            const adminNotifications = admins.map(admin => ({
                                user_id: admin.id,
                                title: 'New Payment Received Admin',
                                message: adminMessage,
                                type: 'info',
                                created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
                            }));
                            
                            // Insert notifications one by one with explicit column names
                            for (const notification of adminNotifications) {
                                try {
                                    await proxyDB(
                                        `INSERT INTO notifications 
                                         (user_id, title, message, type, created_at, is_read) 
                                         VALUES (?, ?, ?, ?, ?, 0)`,
                                        [
                                            notification.user_id,
                                            notification.title,
                                            notification.message,
                                            notification.type,
                                            notification.created_at
                                        ]
                                    );
                                } catch (error) {
                                    console.error('Error creating admin notification:', error);
                                }
                            }
                        }
                    }
                } catch (notificationError) {
                    console.error('Error creating notifications:', notificationError);
                    // Don't fail the whole process if notifications fail
                }
                
                console.log(`Successfully processed payment - Transaction: ${transaction_id}, ` +
                    `Amount: KES ${amount}, M-Pesa: ${mpesaReceipt}${loan_id ? `, Loan: ${loan_id}` : ''}`);
                
            } catch (error) {
                console.error('Error processing successful payment:', error);
                // Still return success to M-Pesa to prevent retries
                return res.json({ ResultCode: 0, ResultDesc: 'Error processing payment' });
            }
        } else {
            console.log(`Payment not successful. ResultCode: ${ResultCode}, Description: ${ResultDesc}`);
            
            // Update payment mapping status to failed for non-zero result codes
            try {
                await proxyDB(
                    'UPDATE payment_mappings SET status = ? WHERE checkout_request_id = ?',
                    ['failed', CheckoutRequestID]
                );
                
                // Update transaction status to failed
                await proxyDB(
                    'UPDATE transactions SET status = ? WHERE id IN (SELECT transaction_id FROM payment_mappings WHERE checkout_request_id = ?)',
                    ['failed', CheckoutRequestID]
                );
                
            } catch (updateError) {
                console.error('Error updating failed payment status:', updateError);
            }
        }
        
        // Always acknowledge receipt of the callback to M-Pesa
        res.json({ ResultCode: 0, ResultDesc: 'Callback processed successfully' });
        
    } catch (error) {
        console.error('Error in M-Pesa callback handler:', error);
        // Still return success to prevent M-Pesa from retrying
        res.json({ ResultCode: 0, ResultDesc: 'Error processing callback' });
    }
}

export { handleMpesaCallback };
