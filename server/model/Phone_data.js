const mongoose = require("mongoose");

const phoneDataSchema = new mongoose.Schema({
	expo_token: {
		type: String,
		required: true,
	},
	uid: {
		type: String,
		required: true,
	},
});

const phoneDataModel = mongoose.model("Phone_Data", phoneDataSchema);

module.exports = phoneDataModel;
