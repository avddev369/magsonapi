// controllers/reportController.js

const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

exports.generateReport = async (req, res) => {
    try {
        let { startDate, endDate } = req.query;

        // Validate startDate and endDate
        if (!startDate && !endDate) {
            return res.status(400).json({ message: 'Either startDate or endDate is required' });
        }

        let whereClause = {};

        // Handle single date case
        if (startDate && !endDate) {
            whereClause = {
                createdAt: {
                    [Op.gte]: startDate
                }
            };
        }

        // Handle date range case
        if (startDate && endDate) {
            whereClause = {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            };
        }

        // Fetch transactions based on the where clause
        const transactions = await Transaction.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']] // Assuming 'createdAt' is the timestamp field
        });

        // Calculate total amount and discounted amount for all transactions
        let totalAmount = 0;
        let totalDiscountedAmount = 0;
        transactions.forEach(transaction => {
            totalAmount += transaction.amount;
            totalDiscountedAmount += transaction.discountedAmount || 0; // Handle null discountedAmount
        });

        // Format the report data
        const reportData = {
            transactions: transactions.map(transaction => ({
                id: transaction.id,
                customerId: transaction.customerId,
                shopId: transaction.shopId,
                amount: transaction.amount,
                discountedAmount: transaction.discountedAmount,
                redeemedAmount: transaction.redeemedAmount,
                retainedPercentage: transaction.retainedPercentage,
                createdAt: transaction.createdAt
            })),
            totalAmount,
            totalDiscountedAmount
        };

        res.status(200).json(reportData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
