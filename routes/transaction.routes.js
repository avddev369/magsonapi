module.exports = app => {
    const transaction = require("../controllers/transactionController.js");

    var router = require("express").Router();

    router.post("/createTransaction", transaction.createTransaction);

    app.use("/", router);
};
      