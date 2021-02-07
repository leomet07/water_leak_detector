const router = require("express").Router();
const verifyToken = require("../auth/verifyTokenMiddleware");
const isAdminMiddleware = require("../auth/isAdminMiddleware");
const Leak = require("../../model/Leak");
// const io = ;

router.use(verifyToken);

// Get all the cards, or search by params in request body.
router.get("/get_leaks", async (req, res) => {
	try {
		console.log("req.user in get_leaks", req.user);

		let leaks = await Leak.find({ uid: req.user._id });

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
	console.log("req.user", req.user);
	console.log("Body", req.body);

	const uid = req.user._id;

	const leak = new Leak({
		date: Date.now().toString(),
		uid: uid,
	});

	savedLeak = await leak.save();

	res.json({ created: true, leak: savedLeak });

	const io = require("../../index").io;
	[...io.sockets.sockets.values()].some(async (element) => {
		console.log("element decoded inside of some", element.decoded);
		let value = element.decoded._id == uid;

		if (value) {
			element.emit("leak_added", savedLeak);
		}
		return value;
	});
	// io.sockets.emit("leak_added", savedLeak);
});

setInterval(async function () {
	const io = require("../../index").io;

	// io.sockets.emit("db_check", leaks);

	// console.log(io.sockets.sockets.size);
	io.sockets.sockets.forEach(async (element) => {
		// console.log(element.decoded);
		let leaks = await Leak.find({ uid: element.decoded._id });
		element.emit("db_check", leaks);
	});
	// TODO: loop through all connected verified users and just dump all the leaks that happened under their account.
}, 2000);

module.exports.router = router;
