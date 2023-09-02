import React, { useEffect, useState } from "react";
import {
    Animated, Easing,
    PermissionsAndroid, Pressable,
    SafeAreaView, ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import BluetoothService, { BluetoothDevice } from "../services/BluetoothService";
import { useBluetooth } from "../hooks/useBluetooth";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { StackNavigationProp } from "@react-navigation/stack";
import Device from "../components/Device";
import Spinner from "../icons/spinner.svg";

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

    const [search, setSearch] = useState<string>("");
    const spinValue = new Animated.Value(0);

    useEffect(() => {
        if (discovering)
            Animated.loop(
                Animated.timing(
                    spinValue,
                    {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.linear,
                        useNativeDriver: true
                    }
                )
            ).start();
        else
            spinValue.stopAnimation();
    }, [discovering, spinValue]);

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
            } catch (error: any) {
                setAccepting(false);
                return;
            }

            setAccepting(false);
            void acceptConnections();
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
            const discovered = await BluetoothService.startDiscovery()
                .then(devices => new Map(devices.map(device => [device.address, device])));

            setDiscoveredDevices(prevDiscoveredDevices => new Map([...prevDiscoveredDevices, ...discovered]));
        } catch (error: any) {
        }

        setDiscovering(false);
    }

    async function handleDevice(device: BluetoothDevice) {
        // @ts-ignore
        navigation.navigate("Device", { device: device._nativeDevice });
    }

    const lowerCaseSearch = search.toLowerCase();
    const filteredConnectedDevices = Array.from(connectedDevices.values()).filter(device => device.name.toLowerCase().includes(lowerCaseSearch));
    const filteredPairedDevices = Array.from(pairedDevices.values()).filter(device => device.name.toLowerCase().includes(lowerCaseSearch));
    const filteredDiscoveredDevices = Array.from(discoveredDevices.values()).filter(device => device.name.toLowerCase().includes(lowerCaseSearch));

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
    });

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <TextInput onChangeText={setSearch} value={search} placeholder={"Zoek apparaat"} />
                <View style={styles.header}>
                    <Text style={styles.headerText}>Verbonden apparaten</Text>
                    <Text style={styles.headerSectionCount}>{filteredConnectedDevices.length}</Text>
                </View>

                {filteredConnectedDevices.map(device => (
                    <Device key={device.address} device={device} />
                ))}

                <View style={styles.header}>
                    <Text style={styles.headerText}>Gekoppelde apparaten</Text>
                    <Text style={styles.headerSectionCount}>{filteredPairedDevices.length}</Text>
                </View>

                {filteredPairedDevices.map(device => (
                    <Device key={device.address} device={device} />
                ))}

                <View style={styles.header}>
                    <Text style={styles.headerText}>Apparaten in de buurt</Text>
                    <Text style={styles.headerSectionCount}>{filteredDiscoveredDevices.length}</Text>

                    <Pressable onPress={getNewDevices} style={styles.discoverButton}>
                        <Animated.View style={{ transform: [{ rotate: spin }] }}>
                            <Spinner width={20} height={20} color={"#1C1C1E"} />
                        </Animated.View>
                    </Pressable>
                </View>

                {filteredDiscoveredDevices.map(device => (
                    <Device key={device.address} device={device} />
                ))}
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flexGrow: 1
    },
    header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginVertical: 5
    },
    headerText: {
        color: "#1C1C1E",
        fontSize: 16,
        fontWeight: "bold"
    },
    headerSectionCount: {
        color: "#1C1C1E",
        fontSize: 16,
        fontWeight: "bold",
        backgroundColor: "#E6E6E6",
        paddingHorizontal: 5,
        borderRadius: 5
    },
    discoverButton: {
        backgroundColor: "#E6E6E6",
        padding: 5,
        borderRadius: 30 / 2,
        marginLeft: "auto"
    }
});

export default DeviceList;
