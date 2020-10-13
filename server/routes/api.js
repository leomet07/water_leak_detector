const router = require("express").Router();
const dbRouter = require("./db/db").router

// Get all the cards, or search by params in request body.
router.use("/db", dbRouter);


module.exports.router = router;