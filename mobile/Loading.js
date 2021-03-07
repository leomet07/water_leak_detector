import React, { Component } from "react";
import { Text, View, TextInput, Button, TouchableOpacity } from "react-native";
import styles from "./Styles";
export default class LoginScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			globals: props.route.params.globals,
		};
	}

	async componentDidMount() {}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Loading Screen</Text>
			</View>
		);
	}
}
