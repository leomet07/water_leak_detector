const mongoose = require("mongoose");

const leakSchema = new mongoose.Schema({
	date : {
		type: Date,
		required: true,
		
	}
});

const leakModel = mongoose.model("Leak",leakSchema);

module.exports = leakModel;