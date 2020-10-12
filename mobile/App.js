
import React, {Component} from "react";

import { StyleSheet, Text, View } from "react-native";
export default class App extends Component {
   
    constructor() {
        super();
        //save the scope so we can use this in a diff scope
        
        this.state = {
            leaks : []
        };
    }
    componentWillUnmount() {
        
    }
    async componentDidMount() {

		console.log("Mounted");

		let response = await fetch("https://waterleakbackend.herokuapp.com/api/db/get_leaks");

		const json = await response.json();

		console.log(JSON.stringify(json))
        
        this.setState({leaks : json});
        //this.registerForPushNotifications()
    }

    

    render() {
		const leakItems = this.state.leaks.map((data) => {

			let uri = data._id;
			console.log(uri)
			return (
				<Text key={uri}>
					{data.date}
				</Text>
			);
		});


        return (
            <View style={styles.container}>
               <Text>Hello</Text>
			   <View>{leakItems}</View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
