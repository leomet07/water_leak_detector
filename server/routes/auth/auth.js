const router = require("express").Router();
const User = require("../../model/User");
const Detector = require("../../model/Detector");
const { registerValidation, loginValidation } = require("./validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
	const validation = registerValidation(req.body);
	if ("error" in validation) {
		console.log(req.body);
		return res.status(200).end(
			JSON.stringify({
				message: validation.error.details[0].message,
				logged_in: false,
			})
		);
	}

	// Check if email exists in db
	const emailExist = await User.findOne({
		email: req.body.email,
	});

	if (emailExist) {
		return res.status(200).end(
			JSON.stringify({
				message: "Email already exists",
				logged_in: false,
			})
		);
	}

	// Hash the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	});
	let savedUser;
	try {
		savedUser = await user.save();
	} catch (err) {
		//res.sendStatus(400).send({logged_inerr);
	}

	// create and assaign a jwt
	const token = jwt.sign(
		{
			_id: savedUser._id,
		},
		process.env.ACCESS_TOKEN_SECRET
	);
	res.header("auth-token", token).send({
		token: token,
		logged_in: true,
	});
});

// LOGIN

router.post("/login", async (req, res) => {
	const validation = loginValidation(req.body);
	if ("error" in validation) {
		return res.status(200).end(
			JSON.stringify({
				logged_in: false,
				message: validation.error.details[0].message,
			})
		);
	}

	// Check if email exists in db
	const user = await User.findOne({
		email: req.body.email,
	});

	if (!user) {
		return res.status(200).end(
			JSON.stringify({
				logged_in: false,
				message: "Email doesnt exist",
			})
		);
	}

	// check password status

	const valid_pass = await bcrypt.compare(req.body.password, user.password);

	if (!valid_pass) {
		return res.status(200).end(
			JSON.stringify({
				message: "Invalid password",
				logged_in: false,
			})
		);
	}

	// create and assaign a jwt
	const token = jwt.sign(
		{
			_id: user._id,
		},
		process.env.ACCESS_TOKEN_SECRET
	);
	res.header("auth-token", token).send({
		token: token,
		logged_in: true,
	});
});

router.get("/verify/:id", async (req, res) => {
	let token = req.params.id;

	try {
		const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		console.log(verified);
		const uid = verified._id;

		const userisAdmin = await checkIsAdmin(uid);
		const data = {};
		if (verified) {
			data.valid = true;
			data.isAdmin = userisAdmin;
			data.uid = uid;
			res.send(data);
		}
	} catch (err) {
		console.log("err in /verify", err);
		res.send({
			valid: false,
		});
	}
});
async function checkIsAdmin(uid) {
	const user = await User.findById(uid);
	return user.isAdmin;
}
async function checkIsValidDetector(detectorid) {
	const detector = await Detector.findById(detectorid);
	return detector ? true : false;
}
module.exports = {
	router: router,
	checkIsAdmin: checkIsAdmin,
	checkIsValidDetector: checkIsValidDetector,
};
