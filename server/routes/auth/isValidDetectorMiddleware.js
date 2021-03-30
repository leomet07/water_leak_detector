const checkIsValidDetector = require("./auth").checkIsValidDetector;

module.exports = async function (req, res, next) {
	const detectorid = req.header("detectorid");
	if (!detectorid) {
		return res.status(401).send({
			message:
				"Acess Denied! Include a header of detectorid followed by a valid detector's id!",
		});
	}

	try {
		console.log("is valid detector middle ware");
		// console.log("Detectorid: ", detectorid);
		const detectorIsValid = await checkIsValidDetector(detectorid);
		console.log("Detector is valid: ", detectorIsValid);

		if (detectorIsValid) {
			next();
		} else {
			return res.status(401).send(
				JSON.stringify({
					message: "A detector with that _id doesnt exist",
				})
			);
		}
	} catch (err) {
		console.log("err in is valid detector", err);
		res.status(400).send(JSON.stringify({ message: err.message }));
	}
};
