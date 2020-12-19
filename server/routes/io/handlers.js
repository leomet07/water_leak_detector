function handleuser(user, io) {
	console.log("user connected");
	console.log(user.id);

	user.on("disconnect", () => {
		console.log("user disconnected");
	});
}

module.exports = {
	handleuser: handleuser,
};
