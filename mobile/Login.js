
import React, {Component} from "react";
import { Text, View, TextInput, Button } from "react-native";
import styles from "./Styles";
export default class LoginScreen extends Component {
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

	login = async () => {
		const email = this.state.emailForm;
		const password = this.state.passwordForm;
		console.log({email, password})

		let uri = this.state.globals.BASE_URL + "/api/auth/login";
		console.log(uri)
		const response = await fetch(uri, {
		"method": "POST",
		"headers": {
			"content-type": "application/json"
		},
		"body": JSON.stringify({
			"email": email,
			"password": password
		})
		})

		const json = await response.json()
		console.log(json)
		if (json.logged_in) {
			console.log("Emmiting")
			this.state.globals.emitter.emit('logged_in', json);
		}
		
	}

    render() {
        return (
            <View style={styles.container}>
               <Text style={styles.title}>Login</Text>
			    <TextInput
				style={styles.text_input}
				onChangeText={text => this.setState({emailForm : text })}/>
				<TextInput
				style={styles.text_input}
				onChangeText={text => this.setState({passwordForm : text })}/>


				
				<Button
				onPress={this.login}
				title="Login"
				accessibilityLabel="Login"
				/>
            </View>
        );
    }
}