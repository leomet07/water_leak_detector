import React, { Component } from "react";
import { Text, View, TextInput, Button, TouchableOpacity } from "react-native";
import styles from "./Styles";
export default class RegisterScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			emailForm: "",
			passwordForm: "",
			nameForm: "",
			globals: props.route.params.globals,
		};
	}

	async componentDidMount() {}

	login = async () => {
		const {
			emailForm: email,
			passwordForm: password,
			nameForm: name,
		} = this.state;

		console.log({ email, password, name });

		let uri = this.state.globals.BASE_URL + "/api/auth/register";
		console.log(uri);
		const response = await fetch(uri, {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				email,
				password,
				name,
			}),
		});

		const json = await response.json();
		console.log(json);
		if (json.logged_in) {
			console.log("Emmiting");
			this.state.globals.emitter.emit("logged_in", json);
		}
	};

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Register</Text>
				<TextInput
					style={styles.text_input}
					placeholder="Name"
					onChangeText={(text) => this.setState({ nameForm: text })}
				/>
				<TextInput
					style={styles.text_input}
					placeholder="Email"
					onChangeText={(text) => this.setState({ emailForm: text })}
				/>
				<TextInput
					style={styles.text_input}
					placeholder="Password"
					secureTextEntry={true}
					onChangeText={(text) =>
						this.setState({ passwordForm: text })
					}
				/>

				<TouchableOpacity style={styles.button} onPress={this.login}>
					<Text style={styles.button_text}>Login</Text>
				</TouchableOpacity>
			</View>
		);
	}
}
