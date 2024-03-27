const db = require("../models");
const myRes = require("../utils/responseHandler");

exports.insertData = async (req, res) => {
    try {
        const { table } = req.body;

        if (!table) {
            return myRes.errorResponse(res, "Table name not provided.");
        }

        const fieldsToInsert = req.body || {};
        const validFields = Object.keys(fieldsToInsert).filter(field => field !== "table");

        if (!validFields.length) {
            return myRes.errorResponse(res, "No valid fields provided for insert.");
        }

        const dynamicModel = db[table];

        if (!dynamicModel) {
            return myRes.errorResponse(res, "Table Not Found");
        }

        const newRecord = dynamicModel.build();

        validFields.forEach((field) => {
            newRecord[field] = fieldsToInsert[field];
        });

        await newRecord.save();

        // Return the last inserted record
        const lastRecord = await dynamicModel.findOne({
            where: {
                id: newRecord.id
            }
        });

        myRes.successResponse(res, lastRecord );
    } catch (error) {
        myRes.errorResponse(res, error.message);
    }
};

exports.updateData = async (req, res) => {
    try {
        const { table, id } = req.body;
        let existingData;

        if (!table || !id) {
            return myRes.errorResponse(res, "Table or ID not provided.");
        }

        const dynamicModel = db[table];

        if (!dynamicModel) {
            return myRes.errorResponse(res, "Table Not Found");
        }

        existingData = await dynamicModel.findByPk(id);

        if (!existingData) {
            return myRes.errorResponse(res, "Data not found.");
        }

        const fieldsToUpdate = req.body || {};
        const validFields = Object.keys(fieldsToUpdate).filter(field => !(field === "table" || field === "id"));

        if (!validFields.length) {
            return myRes.errorResponse(res, "No valid fields provided for update.");
        }

        validFields.forEach((field) => {
            existingData[field] = fieldsToUpdate[field];
        });

        await existingData.save();

        // Return the updated record
        const updatedRecord = await dynamicModel.findByPk(id);

        myRes.successResponse(res, updatedRecord);
    } catch (error) {
        myRes.errorResponse(res, error.message);
    }
};
