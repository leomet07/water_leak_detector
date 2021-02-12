const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const handlers = require("./routes/io/handlers");
const app = express();
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
var http = require("http").createServer(app);
const slowDown = require("express-slow-down");

const io = require("socket.io")(http, {
	cors: {
		origin: "*",
	},
});

if (process.env.dev != "true") {
	console.log("Enforcing rate limits for prod");
	app.set("trust proxy", 1);
	const rateLimiter = rateLimit({
		windowMs: 3 * 60 * 1000, // 3 minutes
		max: 8, // limit each IP to 8 requests per windowMs
	});
	const speedLimiter = slowDown({
		windowMs: 3 * 1000, // half second
		delayAfter: 1, // allow 100 requests per 5 seconds, then...
		delayMs: 2000, // begin adding 500ms of delay per request
	});
	//  apply to all requests
	app.use(rateLimiter);
	app.use(speedLimiter);
} else {
	console.log("Rate limits not enforced in dev.");
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));

// Only redirect to SSL if developer allows and states that machine running this has SSL to prevent crashes on computers without SSL
if (process.env.SSL == "true") {
	app.enable("trust proxy");

	app.use(function (req, res, next) {
		if (req.headers["x-forwarded-proto"] === "https") {
			return next();
		}
		res.redirect("https://" + req.headers.host + req.url);
	});
}

// import Routes
const apiRouter = require("./routes/api").router;

const db_str = process.env.DB_CONNECT;
console.log(db_str);
mongoose.connect(
	db_str,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	},
	() => {
		console.log("connected to db!");
	}
);

//Routes Middleware
app.use("/api/", apiRouter);
app.get("/", function (req, res) {
	res.send("Hello World to Water Leak detector");
});

// const port = process.env.PORT || 4201;
// app.listen(port, () => {
// 	console.log("Sever is up and running at http://127.0.0.1:" + port);
// });
http.listen(process.env.PORT || 3000, function () {
	var host = http.address().address;
	var port = http.address().port;
	console.log("App listening at http://%s:%s", host, port);
});

io.use(function (socket, next) {
	if (socket.handshake.query && socket.handshake.query.token) {
		jwt.verify(
			socket.handshake.query.token,
			process.env.ACCESS_TOKEN_SECRET,
			function (err, decoded) {
				if (err) {
					console.log("Socket not provided an auth token. ");
					return next(new Error("Authentication error"));
				}
				socket.decoded = decoded;
				next();
			}
		);
	} else {
		next(new Error("Authentication error"));
	}
});

io.on("connection", (client) => {
	// console.log("socket connection", client.decoded);
	handlers.handleuser(client, io);
});

module.exports.io = io;
