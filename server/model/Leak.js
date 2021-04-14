const mongoose = require("mongoose");

const leakSchema = new mongoose.Schema({
	date: {
		type: Date,
		required: true,
	},
	uid: {
		type: String,
		required: true,
	},

	detector: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Detector",
		required: true,
	},
});

const leakModel = mongoose.model("Leak", leakSchema);

module.exports = leakModel;
