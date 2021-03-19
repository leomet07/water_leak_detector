const mongoose = require("mongoose");

const detectorDataSchema = new mongoose.Schema({
	location: {
		type: String,
	},
	name: {
		type: String,
		required: true,
	},
	uid: {
		type: String,
		required: true,
	},
});

const phoneDataModelfordb = mongoose.model("Detector", detectorDataSchema);

module.exports = phoneDataModelfordb;
