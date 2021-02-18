const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const rateLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 3 minutes
	max: 8, // limit each IP to 8 requests per windowMs,
	message: {
		message: "Too many requests, slow down",
	},
});
const speedLimiter = slowDown({
	windowMs: 4.5 * 1000, // half second
	delayAfter: 3, // allow 100 requests per 5 seconds, then...
	delayMs: 1000, // begin adding 500ms of delay per request
});
//  apply to all requests
module.exports = { rateLimiter, speedLimiter };
