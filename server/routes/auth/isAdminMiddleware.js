const checkIsAdmin = require("./auth").checkIsAdmin;
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
	const token = req.header("auth-token");
	if (!token) {
		return res.status(401).end({ message: "Acess Denied!" });
	}

	try {
		console.log("is admin middle ware");

		const uid = req.user._id;

		const userisAdmin = await checkIsAdmin(uid);

		if (userisAdmin) {
			next();
		} else {
			return res
				.status(401)
				.end(JSON.stringify({ message: "No admin permissions" }));
		}
	} catch (err) {
		console.log("err in is admin", err);
		res.status(400).end(
			JSON.stringify({ message: "Invalid token -> Acess denied" })
		);
	}
};
