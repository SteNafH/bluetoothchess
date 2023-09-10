import "react-native-gesture-handler";

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Game from "./screens/Game";
import DeviceList from "./screens/DeviceList";
import { BluetoothNativeDevice } from "react-native-bluetooth-classic";
import { BluetoothProvider } from "./contexts/BluetoothContext";
import Challenge from "./screens/Challenge";

export type RootStackParamList = {
    Home: undefined;
    Challenge: { device: BluetoothNativeDevice };
    Game: { device: BluetoothNativeDevice, color: boolean | undefined, timeControl: string };
};

const Stack = createStackNavigator<RootStackParamList>();

function App() {
    return (
        <BluetoothProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{
                    presentation: "modal",
                    headerTitleAlign: "center",
                    headerTintColor: "#fff",
                    headerStyle: {
                        backgroundColor: "#252422",
                        elevation: 0,
                        shadowOpacity: 0
                    },
                    cardStyle: {
                        backgroundColor: "#312D2A"
                    }
                }}
                >
                    <Stack.Screen name="Home" options={{ title: "Apparaten" }} component={DeviceList} />
                    <Stack.Screen name="Challenge" options={{ title: "Uitdaging" }} component={Challenge} />
                    <Stack.Screen name="Game" options={{ title: "Spel" }} component={Game} />
                </Stack.Navigator>
            </NavigationContainer>
        </BluetoothProvider>
    );
}

export default App;
