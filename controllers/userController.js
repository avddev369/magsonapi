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
