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
        const { shopId } = req.body;

        if (!shopId) {
            return res.status(400).json({ error: 'shop id parameter is required' });
        }

        const adminCondtion = await db.Condition.findOne({ where: { shopId:shopId} });
        var transactionsWithCustomer = await db.Transaction.findAll({
            wehre: {
                shopId: shopId
            },
            include: [{
                model: db.Customer,

                attributes: ['id', 'name', 'phone_number', 'total_trancCount', 'balance', 'reedem', 'updatedAt'],
            }, {
                model: db.Shop,

                attributes: ['id', 'name', 'retainedPercentage'],
            }],

            attributes: { exclude: ['createdAt', 'updatedAt', 'customerId'] },
            order: [['id', 'DESC']]
        });

        // Day * hours  * minutes  * second * milliseconds  
        var ONE_WEEK_IN_MS = (adminCondtion.maxReedemDays) * 24 * 60 * 60 * 1000;

        transactionsWithCustomer = await Promise.all(transactionsWithCustomer.map(async transaction => {
            const updatedAtDiff = new Date() - new Date(transaction.customer_master.updatedAt);
            var discount = transaction.customer_master.balance - (transaction.customer_master.balance * (transaction.shops_master.retainedPercentage / 100));

            var isAdminMax = discount > (adminCondtion.maxReedemAmount);
            if (updatedAtDiff > ONE_WEEK_IN_MS) {
                await db.Customer.update({ balance: 10 }, { where: { id: transaction.customer_master.id } });
                return { ...transaction.toJSON(), maxReedemAmount: 0, isAdminMax };
            } else {
                return { ...transaction.toJSON(), maxReedemAmount: discount, isAdminMax };
            }
        }));

        const filteredTransactions = transactionsWithCustomer.filter(transaction => transaction.shopId === shopId);
        myRes.successResponse(res, filteredTransactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        myRes.errorResponse(res, { error: 'Internal Server Error' }, 500);
    }
};


exports.insertTransaction = async (req, res) => {
    try {
        const { amount, discountedAmount, shopId, type, phoneNumber, redeemedAmount } = req.body;

        // if (!shopId || !phoneNumber || !amount || !discountedAmount || !type || !redeemedAmount) {
        //     return res.status(400).json({ error: 'amount, discountedAmount, shopId, type, phoneNumber, redeemedAmount parameters are required' });
        // }

        let customer = await db.Customer.findOne({
            where: {
                phone_number: phoneNumber,
                shop_id: shopId
            }
        });

        if (!customer) {
            customer = await db.Customer.create({
                balance: 0,
                phone_number: phoneNumber,
                total_trancCount: 0,
                reedem: 0,
                shop_id: shopId,
            });
        }

        let newTransaction;

        if (type === 'discount') {
            newTransaction = await db.Transaction.create({
                customerId: customer.id,
                amount,
                discountedAmount,
                shopId
            });

            await customer.increment({
                balance: discountedAmount, // New Discount Amount
                total_trancCount: 1
            });
        } else if (type === 'redeem') {
            newTransaction = await db.Transaction.create({
                customerId: customer.id,
                amount,
                redeemedAmount,
                shopId
            });

            await customer.increment({
                balance: -redeemedAmount, // Reatin Discount Amount
                total_trancCount: 1
            });
        } else {
            return res.status(400).json({ error: 'Invalid transaction type' });
        }

        myRes.successResponse(res, newTransaction);
    } catch (error) {
        console.error('Error inserting transaction:', error);
        myRes.errorResponse(res, { error: 'Internal Server Error' }, 500);
    }
};

exports.getAllTransactionByDate = async (req, res) => {
    try {
        const { shopId, startDate, endDate } = req.body;

        // Check if shopId and startDate are provided
        if (!shopId || !startDate) {
            return res.status(400).json({ error: 'shopId and startDate parameters are required' });
        }

        // Convert startDateTime to start of day and endDateTime to end of day
        let startDateTime = new Date(startDate);
        startDateTime.setHours(0, 0, 0, 0);

        let endDateTime = endDate ? new Date(endDate) : new Date(startDateTime);
        endDateTime.setHours(23, 59, 59, 999);

        // Validate date range
        if (startDateTime >= endDateTime) {
            return res.status(400).json({ error: 'startDate must be before endDate' });
        }

        // Fetch transactions within the specified date range
        const transactionsWithCustomer = await db.Transaction.findAll({
            where: {
                shopId: shopId,
                createdAt: {
                    [db.Sequelize.Op.and]: [
                        { [db.Sequelize.Op.gte]: startDateTime },
                        { [db.Sequelize.Op.lte]: endDateTime }
                    ]
                }
            },
            include: [{
                model: db.Customer,
                attributes: ['id', 'name', 'phone_number', 'total_trancCount', 'balance', 'reedem', 'updatedAt'],
            }, {
                model: db.Shop,
                attributes: ['id', 'name', 'retainedPercentage'],
            }],
            attributes: { exclude: ['updatedAt', 'customerId'] },
            order: [['id', 'DESC']]
        });

        const shopFind = await db.Shop.findByPk(shopId);
        const filteredTransactions = transactionsWithCustomer.filter(transaction => transaction.shopId === shopId);
        myRes.successResponse(res, {shop:shopFind,transactions:filteredTransactions,});
    } catch (error) {
        // Handle errors
        console.error('Error fetching transactions:', error);
        myRes.errorResponse(res, { error: 'Internal Server Error' }, 500);
    }
};


exports.updateConditionByShopId = async (req, res) => {
    const { shopId,maxReedemDays, maxReedemAmount } = req.body;

    try {
        let condition;

        if (maxReedemDays !== undefined && maxReedemAmount !== undefined) {
            condition = await db.Condition.update(
                { maxReedemDays, maxReedemAmount },
                { where: { shopId } }
            );
        } 
        condition = await db.Condition.findOne({ where: { shopId } });

        if (!condition) {
            myRes.errorResponse(res, { error: 'Condition data not found for the provided shop ID' }, 200);
        }

        myRes.successResponse(res, condition);
    } catch (error) {
        console.error('Error updating condition data:', error);
        myRes.errorResponse(res, { error: 'Internal Server Error' }, 500);

    }
};
