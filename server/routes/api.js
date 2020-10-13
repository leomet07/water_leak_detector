const router = require("express").Router();
const dbRouter = require("./db/db").router;
const authRouter = require("./auth/auth").router;

// Get all the cards, or search by params in request body.
router.use("/db", dbRouter);
router.use("/auth", authRouter);


module.exports.router = router;