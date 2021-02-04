import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: "15%",

		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 25,
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
	},
});
