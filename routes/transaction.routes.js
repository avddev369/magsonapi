module.exports = app => {
    const transaction = require("../controllers/transactionController.js");

    var router = require("express").Router();

    router.post("/createTransaction", transaction.createTransaction);
    router.post("/getAllTransaction", transaction.getAllTransaction);
    app.use("/", router);
};
      