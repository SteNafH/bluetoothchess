import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DeviceListController from "./controllers/device-list.controller";
import ChatController from "./controllers/chat.controller";

const Stack = createNativeStackNavigator<RootStackParamList>();

function Index() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={'DeviceList'}>
                <Stack.Screen name={'DeviceList'} component={DeviceListController}/>
                <Stack.Screen name={'Chat'} component={ChatController} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Index;