
import React, {Component} from "react";
import { Text, View } from "react-native";
import styles from "./Styles";
import globals from "./Globals"
export default class HomeScreen extends Component {
	constructor(props) {
		super(props);
		// console.log("props", props.route.params.globals)
        this.state = {
			leaks : [],
			globals : props.route.params.globals
        };
	}

	async componentDidMount() {

		console.log("Mounted");

		let uri = this.state.globals.BASE_URL + "/api/db/get_leaks"
		let response = await fetch(uri);

		const json = await response.json();

		// console.log(JSON.stringify(json))
        
        this.setState({leaks : json});
        
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


        return (
            <View style={styles.container}>
               <Text style={styles.title}>Water Leak Detector</Text>
			   { this.state.leaks.length > 0 ? <View>{leakItems}</View> : <Text>Loading....</Text>}
            </View>
        );
    }
}