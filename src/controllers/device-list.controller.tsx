import React, {useState, useEffect} from 'react';
import BluetoothModel from '../models/bluetooth.model';
import DeviceList from '../views/device-list.view';
import {useNavigation} from "@react-navigation/native";
import type {BluetoothDevice} from "react-native-bluetooth-classic";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";

function DeviceListController() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [devices, setDevices] = useState<BluetoothDevice[]>([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            BluetoothModel.getPairedDevices().then((deviceList) => {
                setDevices([...devices, ...deviceList]);
            });

            BluetoothModel.scanDevices().then((deviceList) => {
                setDevices([...devices, ...deviceList]);
            });
        });

        return unsubscribe;
    }, [navigation]);

    const handleDeviceSelected = (deviceId: string) => {
        navigation.navigate('Chat', {deviceId});
    };

    return <DeviceList devices={devices} onDeviceSelected={handleDeviceSelected} />;
}

export default DeviceListController;