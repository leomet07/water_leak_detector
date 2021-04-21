import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: "15%",
		padding: 10,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 25,
	},
	subtitle: {
		fontSize: 20,
	},
	text_input: {
		height: 40,
		borderColor: "black",
		borderWidth: 3,
		fontSize: 18,
		padding: 5,
		marginTop: 5,
		paddingLeft: 9,
		width: "92%",
		marginBottom: 10,
	},
	button: {
		backgroundColor: "#2296f3",
		borderColor: "white",
		borderWidth: 1,

		color: "white",
		fontSize: 24,
		fontWeight: "bold",
		overflow: "hidden",
		padding: 8,
		textAlign: "center",
	},
	button_text: {
		color: "white",
		fontSize: 18,
	},
	scrollview_wrapper: {
		height: "65%",
		width: "90%",
	},
	leak_div: {
		borderWidth: 4,
		borderColor: "#20232a",
		borderRadius: 6,
		padding: 10,
		margin: 10,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loading_gif: {
		width: 200,
		height: 200,
	},
	center_text: {
		textAlign: "center",
	},
	link: {
		color: "blue",
		textDecorationLine: "underline",
	},
	loading_icon: {
		width: 25,
		height: 25,
	},
});
