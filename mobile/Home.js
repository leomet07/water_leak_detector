import React, { Component } from "react";
import { Text, Image, View, ScrollView } from "react-native";
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
			"logged_out_finished",
			(listener = this.logged_out_callback)
		);

		this.state.globals.emitter.on(
			"new_leak",
			(listener = this.new_leak_callback)
		);
		this.state.globals.emitter.on(
			"db_check",
			(listener = this.db_check_callback)
		);
	}

	async componentWillUnmount() {
		this.state.globals.emitter.off("logged_out_finished", listener);
	}

	makeApiRequest = async (token) => {
		let leaks = null;
		if (token) {
			while (!Array.isArray(leaks)) {
				let uri = this.state.globals.BASE_URL + "/api/db/get_leaks";
				this.setState({ requestSent: true });
				let response = await fetch(uri, {
					method: "GET",
					headers: {
						"auth-token": token,
					},
				});

				leaks = await response.json();

				console.log("leakss recieved from api", leaks);

				this.setState({ leaks: leaks });
			}
		}
	};
	logged_out_callback = async () => {
		console.log("no token here");

		const token_get = await functions.get_token();
		console.log("token_get:", token_get);
		await this.makeApiRequest(token_get);
	};
	new_leak_callback = async (data) => {
		// console.log("data from in home: ", data);
		const leaks = this.state.leaks;
		// console.log(leaks.length);
		leaks.push(data);
		// console.log(leaks.length);
		this.setState({ leaks: leaks });
	};
	db_check_callback = async (data) => {
		// this.setState({ leaks: data });
	};

	render() {
		const leakItems = this.state.leaks.map((data) => {
			let uri = data._id;
			// console.log(uri)
			return (
				<View style={styles.leak_div} key={uri}>
					<Text>{data.date}</Text>
				</View>
			);
		});

		const loader = this.state.requestSent ? (
			<React.Fragment>
				<Text>Waiting for response</Text>
				<Image
					style={styles.loading_gif}
					source={require("./assets/loading.gif")}
				/>
			</React.Fragment>
		) : (
			<Text>Loading...</Text>
		);
		// console.log(this.state.requestSent ? "request sent" : "not sent")

		return (
			<View style={styles.container}>
				<Text style={styles.title}>Home</Text>
				{this.state.leaks.length > 0 ? (
					<View style={styles.scrollview_wrapper}>
						<ScrollView>{leakItems}</ScrollView>
					</View>
				) : (
					<React.Fragment>{loader}</React.Fragment>
				)}
			</View>
		);
	}
}
