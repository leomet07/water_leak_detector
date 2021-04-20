import React, { Component } from "react";
import { Text, View, Image } from "react-native";
import styles from "./Styles";
export default class LoadingScreen extends Component {
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
				<Text style={styles.title}>Loading...</Text>
				<Text>Establishing a connection...</Text>
				<Image
					style={styles.loading_gif}
					source={require("./assets/loading.gif")}
				/>
			</View>
		);
	}
}
