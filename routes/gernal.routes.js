module.exports = app => {
    const gernal = require("../controllers/gernalController.js");

    var router = require("express").Router();

    router.post("/insertData", gernal.insertData);
    router.post("/updateData", gernal.updateData);
    app.use("/", router);
};
      