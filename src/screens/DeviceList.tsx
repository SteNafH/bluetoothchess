import React, { useEffect, useState } from "react";
import { PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import BluetoothService, { BluetoothDevice } from "../services/BluetoothService";
import { useBluetooth } from "../hooks/useBluetooth";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { StackNavigationProp } from "@react-navigation/stack";
import Device from "../components/Device";

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
    const enabled = useBluetooth();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [discovering, setDiscovering] = useState<boolean>(false);
    const [accepting, setAccepting] = useState<boolean>(false);
    const [connectedDevicesFound, setConnectedDevicesFound] = useState<boolean>(false);
    const [pairedDevicesFound, setPairedDevicesFound] = useState<boolean>(false);

    const [connectedDevices, setConnectedDevices] = useState<Map<string, BluetoothDevice>>(new Map());
    const [pairedDevices, setPairedDevices] = useState<Map<string, BluetoothDevice>>(new Map());
    const [discoveredDevices, setDiscoveredDevices] = useState<Map<string, BluetoothDevice>>(new Map());

    useEffect(() => {

    }, []);

    useEffect(() => {
        async function getConnectedDevices() {
            if (connectedDevicesFound)
                return;

            try {
                const connected = await BluetoothService.getConnectedDevices()
                    .then(devices => new Map(devices.map(device => [device.address, device])));

                setConnectedDevices(connected);
                setConnectedDevicesFound(true);
            } catch (error: any) {
            }
        }

        async function getPairedDevices() {
            if (pairedDevicesFound)
                return;

            try {
                const paired = await BluetoothService.getBondedDevices()
                    .then(devices => new Map(devices.map(device => [device.address, device])));

                setPairedDevices(paired);
                setPairedDevicesFound(true);
            } catch (error: any) {
            }
        }

        async function acceptConnections() {
            if (accepting)
                return;

            setAccepting(true);
            try {
                const device = await BluetoothService.accept({ delimiter: "\r" });

                if (device)
                    handleDevice(device);

                void acceptConnections();
            } catch (error: any) {
            }
            setAccepting(false);
        }

        if (enabled) {
            void getConnectedDevices();
            void getPairedDevices();
            void acceptConnections();
            void getNewDevices();
        }

        return () => {
            void BluetoothService.cancelDiscovery()
                .catch(() => undefined);
            void BluetoothService.cancelAccept()
                .catch(() => undefined);
        };
    }, [enabled]);

    async function getNewDevices() {
        if (discovering)
            return;

        try {
            const granted = await requestAccessFineLocationPermission();

            if (!granted)
                throw new Error("Access fine location was not granted");

            setDiscovering(true);
            const discoverd = await BluetoothService.startDiscovery()
                .then(devices => new Map(devices.map(device => [device.address, device])));

            setDiscoveredDevices(prevDiscoveredDevices => new Map([...prevDiscoveredDevices, ...discoverd]));
        } catch (error: any) {
        }

        setDiscovering(false);
    }

    async function handleDevice(device: BluetoothDevice) {
        // @ts-ignore
        navigation.navigate("Device", { device: device._nativeDevice });
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <Text style={styles.header}>Verbonden apparaten</Text>
                {Array.from(connectedDevices.entries()).map(([key, device]) => {
                    return (
                        <Device key={"device-" + key} device={device} />
                    );
                })}

                <Text style={styles.header}>Gekoppelde apparaten</Text>
                {Array.from(pairedDevices.entries()).map(([key, device]) => {
                    return (
                        <Device key={"device-" + key} device={device} />
                    );
                })}

                <Text style={styles.header}>Apparaten in de buurt</Text>
                {Array.from(discoveredDevices.entries()).map(([key, device]) => {
                    return (
                        <Device key={"device-" + key} device={device} />
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20
    },
    header: {
        color: "#1C1C1E",
        fontSize: 16,
        fontWeight: "bold"
    }
});

export default DeviceList;
