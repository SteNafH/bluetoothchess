import React, { useEffect, useState } from "react";
import { PermissionsAndroid, SafeAreaView, ScrollView, Text, View } from "react-native";
import { BluetoothDevice } from "../services/BluetoothService";
import { useBluetooth } from "../hooks/useBluetooth";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { StackNavigationProp } from "@react-navigation/stack";
import DeviceIcon from "../components/DeviceIcon";

const requestAccessFineLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: "Access fine location required for discovery",
            message:
                "In order to perform discovery, you must enable/allow " +
                "fine location access.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
        }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
};

function DeviceList() {
    const bluetooth = useBluetooth();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [devices, setDevices] = useState<Map<string, BluetoothDevice>>(new Map());

    useEffect(() => {
        async function getConnectedDevices() {
            try {
                const connected = await bluetooth.getConnectedDevices()
                    .then(devices => new Map(devices.map(device => [device.address, device])));

                setDevices(prevDevices => new Map([...prevDevices, ...connected]));
            } catch (error: any) {
            }
        }

        async function getPairedDevices() {
            try {
                const bonded = await bluetooth.getBondedDevices()
                    .then(devices => new Map(devices.map(device => [device.address, device])));

                setDevices(prevDevices => new Map([...prevDevices, ...bonded]));
            } catch (error: any) {
            }
        }

        async function acceptConnections() {
            try {
                const device = await bluetooth.accept({ delimiter: "\r" });

                if (device)
                    handleDevice(device);

                void acceptConnections();
            } catch (error: any) {
                console.log(error);
            }
        }

        void acceptConnections();
        void getNewDevices();
        void getConnectedDevices();
        void getPairedDevices();

        return () => {
            void bluetooth.cancelDiscovery()
                .catch(() => undefined);
            void bluetooth.cancelAccept()
                .catch(() => undefined);
        };
    }, []);

    async function getNewDevices() {
        try {
            const granted = await requestAccessFineLocationPermission();

            if (!granted)
                throw new Error("Access fine location was not granted");

            const discoveredDevices = await bluetooth.startDiscovery()
                .then(devices => new Map(devices.map(device => [device.address, device])));

            setDevices(prevDevices => new Map([...prevDevices, ...discoveredDevices]));
        } catch (error: any) {
        }
    }

    async function handleDevice(device: BluetoothDevice) {
        // selectDevice(device);

        // @ts-ignore
        navigation.navigate("Device", { device: device._nativeDevice });
    }

    // console.log(pairedDevices);
    // console.log(connectedDevices);
    // console.log(newDevices);

    return (
        <SafeAreaView>
            <ScrollView style={{ paddingHorizontal: 20 }}>
                <Text style={{ color: "#1c1c1e", fontSize: 16, fontWeight: "bold" }}>Apparaten</Text>
                {Array.from(devices.entries()).map(([key, device], i: number) => {
                    return (
                        <View key={"device-" + key} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 20 }}>
                            <DeviceIcon deviceClass={device.deviceClass} height={30} width={30} />
                            <View>
                                <Text
                                    style={{ color: "#1c1c1e", fontSize: 16, fontWeight: "bold" }}>{device.name}</Text>
                                <Text style={{
                                    color: "#1c1c1e",
                                    fontSize: 14,
                                }}>{device.address}</Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

    export default DeviceList;
