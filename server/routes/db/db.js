const router = require("express").Router();
const verifyToken = require("../auth/verifyTokenMiddleware");
const isAdminMiddleware = require("../auth/isAdminMiddleware");
const isValidDetectorMiddleware = require("../auth/isValidDetectorMiddleware");
const Leak = require("../../model/Leak");
const Phone_Data = require("../../model/Phonedata");
const Detector = require("../../model/Detector");
const fetch = require("node-fetch");
const limiters = require("../../limiters");
router.use(verifyToken);

// Get all the cards, or search by params in request body.
router.get("/get_leaks", async (req, res) => {
	try {
		console.log("req.user in get_leaks", req.user);

		let leaks = await Leak.find({ uid: req.user._id }).populate("detector");

		res.json(leaks);
	} catch (err) {
		console.log(err);
		res.json({
			message: err.message,
		});
	}
});
// Get all the cards, or search by params in request body.
router.post(
	"/create_leak",
	isValidDetectorMiddleware,
	limiters.rateLimiter,
	limiters.speedLimiter,
	async (req, res) => {
		console.log("req.user", req.user);
		console.log("Body", req.body);

		const uid = req.user._id;

		const leak = new Leak({
			date: Date.now().toString(),
			uid: uid,
			detector: req.header("detectorid"),
		});

		const written_leak = await leak.save();

		res.json({ created: true, leak: written_leak });
		const populated_leak = await Leak.findById(written_leak._id).populate(
			"detector"
		);

		const io = require("../../index").io;
		io.sockets.sockets.forEach(async (element) => {
			console.log("element decoded inside of some", element.decoded);
			let value = element.decoded._id == uid;

			if (value) {
				element.emit("leak_added", populated_leak);
			}
			return value;
		});

		// send out notifs
		//find all phone datas with uid
		let phones = await Phone_Data.find({ uid: uid });

		for (let phone of phones) {
			let expo_token = phone.expo_token;
			console.log(expo_token);
			try {
				let response = await fetch(
					"https://exp.host/--/api/v2/push/send",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							to: expo_token,
							title: "Water leak detected!",
							body: "Go stop it!",
						}),
					}
				);

				let json = await response.json();

				console.log(json);
			} catch (err) {
				console.log("Error sending notifs, ", err);
			}
		}
	}
);
// Get all the cards, or search by params in request body.
router.post("/create_phone_data", async (req, res) => {
	console.log("phone data", req.body);
	console.log(req.user);

	let expo_token = req.body.expo_token;
	if (expo_token) {
		console.log("expo token: ", expo_token);

		const to_write = { uid: req.user._id, expo_token: expo_token };

		// expo token never changes
		const updated = await Phone_Data.findOneAndUpdate(
			{ expo_token: expo_token },
			to_write,
			{
				upsert: true,
			}
		);
		const saved = await updated.save();

		return res.json({ phone_data: saved });
	}
});

router.post("/create_detector", async (req, res) => {
	const detector = new Detector({
		location: req.body.location,
		name: req.body.name,
		uid: req.body.uid,
	});

	const savedDetector = await detector.save();
	res.json(savedDetector);
});

setInterval(async function () {
	const io = require("../../index").io;

	// io.sockets.emit("db_check", leaks);

	// console.log(io.sockets.sockets.size);
	io.sockets.sockets.forEach(async (element) => {
		// console.log(element.decoded);
		let leaks = await Leak.find({ uid: element.decoded._id }).populate(
			"detector"
		);
		element.emit("db_check", leaks);
	});
	// TODO: loop through all connected verified users and just dump all the leaks that happened under their account.
}, process.env.interval_ms || 10000);

module.exports.router = router;
