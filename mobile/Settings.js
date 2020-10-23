
import React, {Component} from "react";
import { Text, View, TextInput, Button } from "react-native";
import styles from "./Styles";
export default class SettingsScreen extends Component {
	constructor(props) {
        super(props);
		this.state = {
			emailForm : "",
			passwordForm : "",
			globals : props.route.params.globals
		}
	}

	async componentDidMount() {

		
        
	}

	logout = async () => {
		console.log(this.state.globals)
		console.log("log out")
		this.state.globals.emitter.emit("logged_out");
	}
	

    render() {
        return (
            <View style={styles.container}>
               <Text style={styles.title}>Settings</Text>
			   <Button
				onPress={this.logout}
				title="Logout"
				accessibilityLabel="Learn more about this purple button"
				/>
            </View>
        );
    }
}