
import React, {Component} from "react";
import { Text, View } from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./Styles";
import HomeScreen from "./Home"

if (__DEV__) {
    console.log('Development');
} else {
    console.log('Production');
}


const Tab = createBottomTabNavigator();

export default class App extends Component {
    
    
    componentWillUnmount() {
        
    }
    async componentDidMount() {

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
        token = await Notifications.getExpoPushTokenAsync();
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

    render() {
        let state = this.state;

        return (
				<NavigationContainer>
					<Tab.Navigator screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;

                            if (route.name === "Home") {
                                iconName = focused
                                    ? "ios-information-circle"
                                    : "ios-information-circle-outline";
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
							
						<Tab.Screen name="Home" component={HomeScreen} />
					
					</Tab.Navigator>
				</NavigationContainer>
            
        );
    }
}


