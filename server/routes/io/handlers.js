function handleuser(user, io) {
	console.log("user connected");
	console.log(user.id);

	user.on("disconnect", () => {
		console.log("user disconnected");
	});
}
console.log("Ran main handlers file.");

module.exports = {
	handleuser: handleuser,
};
