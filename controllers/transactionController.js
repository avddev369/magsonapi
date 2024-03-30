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


exports.getAllTransaction = async (req, res) => {
    try {
        // Fetch transactions along with associated customer details
        var transactionsWithCustomer = await db.Transaction.findAll({
            include: [{
                model: db.Customer,
                attributes: ['id', 'name', 'phone_number', 'total_trancCount', 'balance', 'reedem'],
            },{
                model: db.Shop,
               attributes: ['id', 'name', 'retainedPercentage'],
            }],
   
            attributes: { exclude: ['createdAt', 'updatedAt','redeemedAmount','customerId'] },
            order: [['id', 'DESC']] 
        });
        transactionsWithCustomer = transactionsWithCustomer.map(transaction => {
            return {
                ...transaction.toJSON(),
                maxReedemAmount: transaction.customer_master.balance-(transaction.customer_master.balance * (transaction.shops_master.retainedPercentage/100))
            };
        });
  
        myRes.successResponse(res, transactionsWithCustomer);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        myRes.errorResponse(res, { error: 'Internal Server Error' }, 500);
    }
};