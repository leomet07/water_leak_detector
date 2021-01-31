const router = require("express").Router();
const verifyToken = require("../auth/verifyTokenMiddleware");
const isAdminMiddleware = require("../auth/isAdminMiddleware");
const Leak = require("../../model/Leak");
// const io = ;

router.use(verifyToken);

// Get all the cards, or search by params in request body.
router.get("/get_leaks", async (req, res) => {
	try {
		let leaks = await Leak.find({});

		res.json(leaks);
	} catch (err) {
		console.log(err);
		res.json({
			message: err.message,
		});
	}
});
// Get all the cards, or search by params in request body.
router.post("/create", isAdminMiddleware, async (req, res) => {
	console.log("Body", req.body);

	const leak = new Leak({
		date: Date.now().toString(),
	});

	savedLeak = await leak.save();

	res.json({ created: true, leak: savedLeak });

	const io = require("../../index").io;

	io.sockets.emit("leak_added", savedLeak);
});

setInterval(async function () {
	const io = require("../../index").io;

	let leaks = await Leak.find({});

	io.sockets.emit("db_check", leaks);
	// TODO: loop through all connected verified users and just dump all the leaks that happened under their account.
}, 2000);

module.exports.router = router;
