const jwt = require('jsonwebtoken');
const db = require("../models");
const myRes = require("../utils/responseHandler");

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const employee = await db.Employee.findOne({
            where: { username, password },
            include: [{ model: db.Shop, attributes: ['id', 'name'] }]
        });

        if (!employee) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: employee.id }, process.env.JWT_SECRET);
        myRes.successResponse(res, {
            id: employee.id,
            name: employee.name,
            isMaster: employee.isMaster,
            shopId: employee.shop_id,
            shopName: employee.shops_master.name,
            mobile: employee.mobile,
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.customers = async (req, res) => {
    try {
        const { phoneNumber } = req.query;

        if (!phoneNumber) {
            return res.status(400).json({ error: 'Phone number parameter is required' });
        }

        const customers = await db.Customer.findAll({
            where: {
                phone_number: {
                    [db.Sequelize.Op.like]: `${phoneNumber}%`
                }
            },
            include: [db.Shop]
        });

        myRes.successResponse(res, customers);
    } catch (error) {
        console.error('Error searching customers:', error);
        myRes.errorResponse(res, { error: 'Internal Server Error' });
    }
};

exports.getAllCustomer = async (req, res) => {
    try {
        const { shopId } = req.body;

        if (!shopId) {
            return res.status(400).json({ error: 'shop id parameter is required' });
        }

        const customers = await db.Customer.findAll({
            where: {
                shop_id: shopId,

            }
        });

        myRes.successResponse(res, customers);
    } catch (error) {
        console.error('Error searching customers:', error);
        myRes.errorResponse(res, { error: 'Internal Server Error' });
    }
};

exports.getTopCustomerByPurchase = async (req, res) => {
    try {
        const { shopId, limit } = req.body;

        if (!shopId) {
            return res.status(400).json({ error: 'shop id parameter is required' });
        }

        const topCustomers = await db.Transaction.findAll({
            where: {
                shopId: shopId,
            },
            attributes: [
                'customerId',
                [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'totalPurchaseAmount']
            ],
            include: [{
                model: db.Customer,
                attributes: ['id', 'name', 'phone_number', 'balance', 'reedem', 'shop_id'],
            }],
            group: ['transaction.customerId', 'customer_master.id'],
            order: [['totalPurchaseAmount', 'DESC']],
            limit: limit
        });
        myRes.successResponse(res, topCustomers);
    } catch (error) {
        console.error('Error searching customers:', error);
        myRes.errorResponse(res, { error: 'Internal Server Error' });
    }
};


exports.getTotalCounts = async (req, res) => {
    try {
        const { shopId } = req.body;

        if (!shopId) {
            return res.status(400).json({ error: 'shop id parameter is required' });
        }

        const transactionCount = await db.Transaction.count({ where: { shopId: shopId } });
        const customerCount = await db.Customer.count({ where: { shop_id: shopId } });
        
        const totalPurchaseAmount = await db.Transaction.findAll({
            where: {
                shopId: shopId,
            },
            attributes: [
                [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'totalPurchase'],
                [db.sequelize.fn('SUM', db.sequelize.col('discountedAmount')), 'totalDiscounte']
            ]
        });

        myRes.successResponse(res, { totalCount: transactionCount, customerCount,totalPurchaseAmount:totalPurchaseAmount[0] });
    } catch (error) {
        console.error('Error searching customers:', error);
        myRes.errorResponse(res, { error: 'Internal Server Error' });
    }
};
