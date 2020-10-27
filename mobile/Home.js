
import React, {Component} from "react";
import { Text, View } from "react-native";
import styles from "./Styles";
import functions from "./Functions";

export default class HomeScreen extends Component {
	constructor(props) {
		super(props);
		// sconsole.log("props", props)
		console.log("Home Created");
        this.state = {
			leaks : [],
			globals : props.route.params.globals,
			requestSent : false
        };
	}
	

	async componentDidMount() {

		console.log("Home Mounted", this.state.globals);
		this.makeApiRequest(await functions.get_token())
		this.state.globals.emitter.on('checked_token', listener =  async (token) => {
			console.log("Checked Token Recieved")
			
			await this.makeApiRequest(await functions.get_token())
		});

		this.state.globals.emitter.on("logged_out",  listener =  async () => {
			console.log("no token here")
			await this.makeApiRequest(await functions.get_token())
		})

        
	}


	makeApiRequest = async (token) => {

		console.log("auth token ", token )

		let leaks = [];
		if (token){
			
			let uri = this.state.globals.BASE_URL + "/api/db/get_leaks"
			this.setState({requestSent : true})
			let response = await fetch(uri,  {
				"method": "GET",
				"headers": {
				  "auth-token": token
				}
			  });
	
			leaks = await response.json();
			// console.log(leaks)
			
			
			
		}
		this.setState({leaks : leaks});

	}

    render() {
		

		const leakItems = this.state.leaks.map((data) => {

			let uri = data._id;
			// console.log(uri)
			return (
				<Text key={uri}>
					{data.date}
				</Text>
			);
		});

		const loader = this.state.requestSent ? <Text>Waiting For Response</Text> : <Text>Loading...</Text>
		// console.log(this.state.requestSent ? "request sent" : "not sent")
        return (
            <View style={styles.container}>
               <Text style={styles.title}>Water Leak Detector</Text>
		{ this.state.leaks.length > 0 ? <View>{leakItems}</View> : <React.Fragment>{loader}</React.Fragment>}
            </View>
        );
    }
}