import React, { Component } from "react";
import { Text, View, ScrollView } from "react-native";
import styles from "./Styles";
import functions from "./Functions";

export default class HomeScreen extends Component {
	constructor(props) {
		super(props);
		// sconsole.log("props", props)
		console.log("Home Created");
		this.state = {
			leaks: [],
			globals: props.route.params.globals,
			requestSent: false,
		};
	}

	async componentDidMount() {
		console.log("Home Mounted", this.state.globals);
		this.makeApiRequest(await functions.get_token());
		this.state.globals.emitter.on(
			"checked_token",
			(listener = async (token) => {
				console.log("Checked Token Recieved");
				const get_token = await functions.get_token();
				console.log("get_token Recieved: ", get_token);

				await this.makeApiRequest(get_token);
			})
		);

		this.state.globals.emitter.on(
			"logged_out_finished",
			(listener = this.logged_out_callback)
		);

		this.state.globals.emitter.on(
			"new_leak",
			(listener = this.new_leak_callback)
		);
	}

	async componentWillUnmount() {
		this.state.globals.emitter.off("logged_out_finished", listener);
	}

	makeApiRequest = async (token) => {
		let leaks = [];
		if (token) {
			let uri = this.state.globals.BASE_URL + "/api/db/get_leaks";
			this.setState({ requestSent: true });
			let response = await fetch(uri, {
				method: "GET",
				headers: {
					"auth-token": token,
				},
			});

			leaks = await response.json();
			// console.log(leaks)

			this.setState({ leaks: leaks });
		}
	};
	logged_out_callback = async () => {
		console.log("no token here");

		const token_get = await functions.get_token();
		console.log("token_get:", token_get);
		await this.makeApiRequest(token_get);
	};
	new_leak_callback = async (data) => {
		console.log("data from in home: ", data);
		const leaks = this.state.leaks;
		console.log(leaks.length);
		leaks.push(data);
		console.log(leaks.length);
		this.setState({ leaks: leaks });
	};

	render() {
		const leakItems = this.state.leaks.map((data) => {
			let uri = data._id;
			// console.log(uri)
			return <Text key={uri}>{data.date}</Text>;
		});

		const loader = this.state.requestSent ? (
			<Text>Waiting For Response</Text>
		) : (
			<Text>Loading...</Text>
		);
		// console.log(this.state.requestSent ? "request sent" : "not sent")
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Water Leak Detector</Text>
				{this.state.leaks.length > 0 ? (
					<ScrollView>{leakItems}</ScrollView>
				) : (
					<React.Fragment>{loader}</React.Fragment>
				)}
			</View>
		);
	}
}
