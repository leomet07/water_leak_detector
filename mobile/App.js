
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
import SettingsScreen from "./Settings"
import * as Device from 'expo-device';
import { AsyncStorage } from 'react-native';
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
				emitter : emitter,
				token : null
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
		// Check if auth-token is saved in AsyncStorage
		try {
			const value = await AsyncStorage.getItem('@authentication_save:auth_token');
			if (value !== null) {
				// We have data!!
				console.log("Read from Data" , value);
				
				try {
					await AsyncStorage.setItem('@authentication_save:verified_auth_token', value);
					
				} catch (error) {
					// Error saving data
					console.log('Error saving data')
				}

				this.setState({logged_in : true, token : value})
				this.state.globals.emitter.emit("checked_token", value)
				
			}
		  } catch (error) {
			console.log("error reading data", error)
		}

		this.state.globals.emitter.on('logged_in', listener = async (json) => {
			// … react to 'test' event
			console.log("Logged In!", json)
			console.log("Auth server token: " , json.token)
		
			
			
			

			try {
				await AsyncStorage.setItem('@authentication_save:auth_token', json.token);
				await AsyncStorage.setItem('@authentication_save:verified_auth_token', json.token);
				
			} catch (error) {
				// Error saving data
				console.log('Error saving data')
			}
			this.setState({logged_in : true, token : json.token})
			this.state.globals.emitter.emit("checked_token", json.token)

		});
		this.state.globals.emitter.on('logged_out', listener =  async (json) => {
			console.log("Logging Out recieved")
			

			try {
				await AsyncStorage.removeItem('@authentication_save:auth_token');
				await AsyncStorage.removeItem('@authentication_save:verified_auth_token');
				console.log("removed")
			} catch (error) {
				// Error saving data
				console.log('Error deleting data')
			}
			this.state.globals.emitter.emit('logged_out_finished')
			this.setState({logged_in : false, token : null})
			
		});
	}
	
    render() {
        let state = this.state;
		// console.log("Logged in status: " , this.state.logged_in)
		// console.log("app rerendered", this.state)
		const submitGlobals = { globals: { emitter : this.state.globals.emitter, BASE_URL: this.state.globals.BASE_URL, token : this.state.token} };
		// console.log('Submit Globals', submitGlobals.globals)
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
							} else if (route.name === "Settings") {
                                iconName = focused
                                    ? "ios-list-box"
                                    : "ios-list";
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
							
						
						{ this.state.logged_in ? <React.Fragment>
							<Tab.Screen name="Home" initialParams={{ globals: this.state.globals }} component={HomeScreen} />
						<Tab.Screen name="Settings" initialParams={{ globals: this.state.globals }} component={SettingsScreen} />
						
						</React.Fragment> :  <Tab.Screen name="Login" initialParams={submitGlobals} component={LoginScreen} />}
					
					</Tab.Navigator>
				</NavigationContainer>
            
        );
    }
}


