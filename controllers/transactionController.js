const db = require("../models");
const myRes = require("../utils/responseHandler");

exports.createTransaction = async (req, res) => {
    try {
        const { customerId, shopId, amount, discountedAmount } = req.body;

        if (!customerId || !shopId || !amount) {
            return myRes.errorResponse(res, { error: 'customerId, shopId, and amount are required fields' }, 400);
        }

        const newTransaction = await db.Transaction.create({
            customerId: customerId,
            shopId: shopId,
            amount: amount,
            discountedAmount: discountedAmount || 0
        });

        myRes.successResponse(res, newTransaction, 201);
    } catch (error) {
        console.error('Error creating new transaction:', error);
        myRes.errorResponse(res, { error: 'Internal Server Error' }, 500);
    }
};
