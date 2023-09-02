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
import { MagnifyingGlassIcon, SpinnerIcon } from "../icons";

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
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.inputContainer}>
                    <MagnifyingGlassIcon width={20} height={20} color={"#BEBEBE"} />
                    <TextInput onChangeText={setSearch} value={search} placeholder={"Zoek apparaat"}
                               style={styles.input} placeholderTextColor={"#858482"}/>
                </View>

                <View style={styles.header}>
                    <Text style={styles.headerText}>Verbonden apparaten</Text>
                    <Text style={styles.headerSectionCount}>{connectedDevices.size}</Text>
                </View>

                {filteredConnectedDevices.map(device => (
                    <Device key={device.address} device={device} onChallenge={handleDevice} />
                ))}

                <View style={styles.header}>
                    <Text style={styles.headerText}>Gekoppelde apparaten</Text>
                    <Text style={styles.headerSectionCount}>{pairedDevices.size}</Text>
                </View>

                {filteredPairedDevices.map(device => (
                    <Device key={device.address} device={device} onChallenge={handleDevice} />
                ))}

                <View style={styles.header}>
                    <Text style={styles.headerText}>Apparaten in de buurt</Text>
                    <Text style={styles.headerSectionCount}>{discoveredDevices.size}</Text>

                    <Pressable onPress={getNewDevices} style={styles.discoverButton}>
                        <Animated.View style={{ transform: [{ rotate: spin }] }}>
                            <SpinnerIcon width={20} height={20} color={"#FFFFFF"} />
                        </Animated.View>
                    </Pressable>
                </View>

                {filteredDiscoveredDevices.map(device => (
                    <Device key={device.address} device={device} onChallenge={handleDevice} />
                ))}
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#312D2A"
    },
    scrollView: {
        paddingHorizontal: 20,
        flexGrow: 1
    },
    inputContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "#464241",
        paddingHorizontal: 10,
        borderRadius: 10,
        marginVertical: 10
    },
    input: {
        color: "#BEBEBE",
        fontWeight: "bold",
        fontSize: 16,
        flexGrow: 1,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginVertical: 5
    },
    headerText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold"
    },
    headerSectionCount: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        backgroundColor: "#454140",
        paddingHorizontal: 5,
        borderRadius: 5
    },
    discoverButton: {
        backgroundColor: "#252422",
        padding: 5,
        borderRadius: 30 / 2,
        marginLeft: "auto"
    }
});

export default DeviceList;
