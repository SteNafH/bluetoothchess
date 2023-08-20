import 'react-native-gesture-handler';
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Chat from "./screens/Chat";
import DeviceList from "./screens/DeviceList";
import { BluetoothNativeDevice } from "react-native-bluetooth-classic";

export type RootStackParamList = {
    Home: undefined;
    Device: { device: BluetoothNativeDevice };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ presentation: "card", headerTitleAlign: "center" }}>
                <Stack.Screen name="Home" component={DeviceList} />
                <Stack.Screen name="Device" component={Chat} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
