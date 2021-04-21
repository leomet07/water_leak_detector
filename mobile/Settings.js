import React, { Component } from "react";
import { Text, View, TextInput, Button, TouchableOpacity } from "react-native";
import styles from "./Styles";
import Constants from "expo-constants";
export default class SettingsScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showAdvanced: false,
			globals: props.route.params.globals,
			appReleaseVersion: null,
		};
	}

	async componentDidMount() {
		console.log(Constants.platform);
		if (Constants.platform.android) {
			this.setState({
				appReleaseVersion: Constants.platform.android.versionCode,
			});
		} else if (Constants.platform.ios) {
			this.setState({
				appReleaseVersion: Constants.platform.ios.buildNumber,
			});
		}
	}

	logout = async () => {
		console.log(this.state.globals);
		console.log("log out");
		this.state.globals.emitter.emit("logged_out");
	};

	toggleAdvanced = async () => {
		this.setState({ showAdvanced: !this.state.showAdvanced });
	};

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Settings</Text>

				<TouchableOpacity style={styles.button} onPress={this.logout}>
					<Text style={styles.button_text}>Logout</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.button}
					onPress={this.toggleAdvanced}
				>
					<Text style={styles.button_text}>
						{this.state.showAdvanced ? "Hide" : "Show"} Advanced
					</Text>
				</TouchableOpacity>
				{this.state.showAdvanced ? (
					<View style={styles.center_text}>
						<Text style={[styles.subtitle, styles.center_text]}>
							Advanced Information
						</Text>
						<Text style={styles.center_text}>
							App is running in {Constants.appOwnership}
						</Text>
						<Text style={styles.center_text}>
							Platform is {Object.keys(Constants.platform)[0]}
						</Text>
						<Text style={styles.center_text}>
							Native build version for platform is{" "}
							{this.state.appReleaseVersion == null
								? "unknown, running in expo app"
								: this.state.appReleaseVersion}
						</Text>
					</View>
				) : (
					<React.Fragment></React.Fragment>
				)}
			</View>
		);
	}
}
