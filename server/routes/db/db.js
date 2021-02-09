const router = require("express").Router();
const verifyToken = require("../auth/verifyTokenMiddleware");
const isAdminMiddleware = require("../auth/isAdminMiddleware");
const Leak = require("../../model/Leak");
const Phone_Data = require("../../model/Phone_Data");
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
	io.sockets.sockets.forEach(async (element) => {
		console.log("element decoded inside of some", element.decoded);
		let value = element.decoded._id == uid;

		if (value) {
			element.emit("leak_added", savedLeak);
		}
		return value;
	});
	// io.sockets.emit("leak_added", savedLeak);
});
// Get all the cards, or search by params in request body.
router.post("/phone_data", async (req, res) => {
	console.log("phone data", req.body);
	console.log(req.user);

	let expo_token = req.body.expo_token;
	if (expo_token) {
		console.log("expo token: ", expo_token);
		const phone_data = new Phone_Data({
			expo_token: String(expo_token),
			uid: req.user._id,
		});

		savedPhoneData = await phone_data.save();
	}
	return res.json({ message: "phone_data", phone_data: savedPhoneData });
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
}, process.env.interval_ms || 10000);

module.exports.router = router;
