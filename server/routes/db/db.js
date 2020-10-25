const router = require("express").Router();
const verifyToken  = require("../auth/verifyToken");
const Leak = require("../../model/Leak");

router.use(verifyToken)
// Get all the cards, or search by params in request body.
router.get("/get_leaks", async (req, res) => {
	try {
		
		let leaks = await Leak.find({});
		
		res.json(leaks);

	} catch (err) {
		console.log(err)
		res.json({
			message: err.message,
		});
	}
});
// Get all the cards, or search by params in request body.
router.post("/create", async (req, res) => {
	
	console.log("Body" , req.body);

	const leak = new Leak({
		date : Date.now().toString()
	});

	
	savedLeak = await leak.save();
	
	return res.json({ created : true, leak : savedLeak});

	
});


module.exports.router = router;