
import React, {Component} from "react";
import { Text, View } from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./Styles";
import HomeScreen from "./Home"
import LoginScreen from "./Login"
import * as Device from 'expo-device';
var ee = require('event-emitter');

if (__DEV__) {
    console.log('Development');
} else {
    console.log('Production');
}


const Tab = createBottomTabNavigator();

export default class App extends Component {
	constructor() {
		super();
		const emitter = ee();
		this.state = {
			globals : {
				BASE_URL : "https://waterleakbackend.herokuapp.com",
				emitter : emitter
			},
			logged_in : false
		}

	}

	
    
    componentWillUnmount() {
        
	}
	
	registerForPushNotificationsAsync = async () => {
        const { status } = await Permissions.askAsync(
            Permissions.NOTIFICATIONS
        );


        // Stop here if the user did not grant permissions
        if (status !== "granted") {
            alert("No notification permissions!");
            return;
        } else {
            console.log("Notifications are allowed");
        }

        // Get the token that identifies this device
        const token = await Notifications.getExpoPushTokenAsync();
        console.log("My token: " + token);

        if (Platform.OS === "android") {
            console.log("Android");
            Notifications.createChannelAndroidAsync("chat-messages", {
                name: "Chat messages",
                sound: true,
                priority: "high"
            });
        } else {
            console.log("IOS");
        }

    };



    async componentDidMount() {
		if (Device.isDevice){
			console.log("Real Device")
			this.registerForPushNotificationsAsync()
		}
		this.state.globals.emitter.on('logged_in', listener =  (args) => {
			// … react to 'test' event
			console.log("Logged In!")
			this.setState({logged_in : true})
		});
	}
	
	
    render() {
        let state = this.state;
		console.log("Logged in status: " , this.state.logged_in)
        return (
				<NavigationContainer>
					<Tab.Navigator screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;

                            if (route.name === "Home") {
                                iconName = focused
                                    ? "ios-information-circle"
                                    : "ios-information-circle-outline";
                            }  else if (route.name === "Login") {
								iconName = focused ? "md-person" : "md-person";
							}

                            // You can return any component that you like here!
                            return (
                                <Ionicons
                                    name={iconName}
                                    size={size}
                                    color={color}
                                />
                            );
                        }
                    })}
                    tabBarOptions={{
                        activeTintColor: "tomato",
                        inactiveTintColor: "gray"
                    }}>
							
						<Tab.Screen name="Home" initialParams={{ globals: this.state.globals }} component={HomeScreen} />
						{ this.state.logged_in ? <React.Fragment></React.Fragment> :  <Tab.Screen name="Login" initialParams={{ globals: this.state.globals }} component={LoginScreen} />}
					
					</Tab.Navigator>
				</NavigationContainer>
            
        );
    }
}


