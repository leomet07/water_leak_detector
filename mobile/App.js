import React, { Component } from "react";
import { Text, View } from "react-native";
// import { Notifications } from "expo";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./Styles";
import HomeScreen from "./Home";
import LoginScreen from "./Login";
import SettingsScreen from "./Settings";
import * as Device from "expo-device";
import { AsyncStorage } from "react-native";
import { not } from "react-native-reanimated";

const connection_client = require("socket.io-client");

var socket = connection_client("https://waterleakbackend.herokuapp.com/");
socket.on("connect", function () {
	console.log("Socket connected");
});

var ee = require("event-emitter");

if (__DEV__) {
	console.log("Development");
} else {
	console.log("Production");
}

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

export default class App extends Component {
	constructor() {
		super();
		const emitter = ee();
		this.state = {
			globals: {
				BASE_URL: "https://waterleakbackend.herokuapp.com",
				emitter: emitter,
				token: null,
			},
			logged_in: false,
		};
	}

	componentWillUnmount() {}

	registerForPushNotificationsAsync = async () => {
		const { status: existingStatus } = await Permissions.getAsync(
			Permissions.NOTIFICATIONS
		);
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Permissions.askAsync(
				Permissions.NOTIFICATIONS
			);
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			alert("Failed to get push token for push notification!");
			return;
		}
		const token = (await Notifications.getExpoPushTokenAsync()).data;
		console.log(token);
		this.setState({ expoPushToken: token });

		if (Platform.OS === "android") {
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}
	};

	_handleNotification = (notification) => {
		console.log("Notif Recieved in Foreground.", notification);
	};

	_handleNotificationResponse = (response) => {
		console.log(response);
	};
	async componentDidMount() {
		this.state.globals.emitter.on(
			"checked_token",
			(listener = async (data) => {
				if (data.logged_in) {
					console.log("after checked token, user IS  logged in");
				} else {
					console.log("after checked token, user NOT logged in");

					if (socket) {
						socket.disconnect();
					}
				}
			})
		);

		if (Device.isDevice) {
			console.log("Real Device");
			this.registerForPushNotificationsAsync();

			Notifications.addNotificationReceivedListener(
				this._handleNotification
			);

			Notifications.addNotificationResponseReceivedListener(
				this._handleNotificationResponse
			);
		}
		// Check if auth-token is saved in AsyncStorage
		try {
			const value = await AsyncStorage.getItem(
				"@authentication_save:auth_token"
			);
			if (value !== null) {
				// We have data!!
				console.log("Read from Data", value);

				// verify token here

				try {
					await AsyncStorage.setItem(
						"@authentication_save:verified_auth_token",
						value
					);
				} catch (error) {
					// Error saving data
					console.log("Error saving data");
				}

				this.setState({ logged_in: true, token: value });
				console.log("About to emit checked_token ");
				this.state.globals.emitter.emit("checked_token", {
					token: value,
					logged_in: this.state.logged_in,
				});
			} else {
				this.state.globals.emitter.emit("checked_token", {
					token: null,
					logged_in: false,
				});
			}
		} catch (error) {
			console.log("error reading data", error);
		}

		this.state.globals.emitter.on(
			"logged_in",
			(listener = async (json) => {
				// … react to 'test' event
				console.log("Logged In!", json);
				console.log("Auth server token: ", json.token);

				try {
					await AsyncStorage.setItem(
						"@authentication_save:auth_token",
						json.token
					);
					await AsyncStorage.setItem(
						"@authentication_save:verified_auth_token",
						json.token
					);
				} catch (error) {
					// Error saving data
					console.log("Error saving data");
				}
				this.setState({ logged_in: true, token: json.token });

				this.state.globals.emitter.emit("checked_token", {
					logged_in: this.state.logged_in,
					token: json.token,
				});
			})
		);
		this.state.globals.emitter.on(
			"logged_out",
			(listener = async (json) => {
				console.log("Logging Out recieved");

				if (socket) {
					socket.disconnect();
				}

				try {
					await AsyncStorage.removeItem(
						"@authentication_save:auth_token"
					);
					await AsyncStorage.removeItem(
						"@authentication_save:verified_auth_token"
					);
					console.log("removed");
				} catch (error) {
					// Error saving data
					console.log("Error deleting data");
				}
				this.state.globals.emitter.emit("logged_out_finished");
				this.setState({ logged_in: false, token: null });
			})
		);

		socket.on("leak_added", (data) => {
			console.log("leaks added from server", data);
			try {
				this.state.globals.emitter.emit("new_leak", data);
			} catch (err) {
				console.log("error in leak listener: ", err);
			}
		});
	}

	render() {
		let state = this.state;
		// console.log("Logged in status: " , this.state.logged_in)
		// console.log("app rerendered", this.state)
		const submitGlobals = {
			globals: {
				emitter: this.state.globals.emitter,
				BASE_URL: this.state.globals.BASE_URL,
				token: this.state.token,
			},
		};
		// console.log('Submit Globals', submitGlobals.globals)
		return (
			<NavigationContainer>
				<Tab.Navigator
					screenOptions={({ route }) => ({
						tabBarIcon: ({ focused, color, size }) => {
							let iconName;

							if (route.name === "Home") {
								iconName = focused
									? "ios-information-circle"
									: "ios-information-circle-outline";
							} else if (route.name === "Login") {
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
						},
					})}
					tabBarOptions={{
						activeTintColor: "tomato",
						inactiveTintColor: "gray",
					}}
				>
					{this.state.logged_in ? (
						<React.Fragment>
							<Tab.Screen
								name="Home"
								initialParams={{ globals: this.state.globals }}
								component={HomeScreen}
							/>
							<Tab.Screen
								name="Settings"
								initialParams={{ globals: this.state.globals }}
								component={SettingsScreen}
							/>
						</React.Fragment>
					) : (
						<Tab.Screen
							name="Login"
							initialParams={submitGlobals}
							component={LoginScreen}
						/>
					)}
				</Tab.Navigator>
			</NavigationContainer>
		);
	}
}
