import React, { Component } from "react";
import {
	Text,
	View,
	TextInput,
	Button,
	TouchableOpacity,
	Linking,
} from "react-native";
import styles from "./Styles";
export default class AboutScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	async componentDidMount() {}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>About</Text>
				<Text style={styles.center_text}>
					This mobile app was created for leomet07's water leak
					detector system.
				</Text>
				<Text
					style={styles.link}
					onPress={() =>
						Linking.openURL(
							"***REMOVED***"
						)
					}
				>
					Visit the project!
				</Text>
			</View>
		);
	}
}
