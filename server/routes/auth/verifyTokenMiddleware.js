const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
	const token = req.header("auth-token");
	if (!token) {
		console.log("verify token middleware says access denied");
		return res.status(401).end({ message: "Acess Denied!" });
	}

	try {
		console.log("verify token middleware says token: ", token);
		const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		req.user = verified;

		next();
	} catch (err) {
		console.log("verify token middleware says error! ", err);
		res.status(400).end({ message: "Invalid token -> Acess denied" });
	}
};
