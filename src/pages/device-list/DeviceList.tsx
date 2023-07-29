import React, { useEffect, useState } from "react";
import { PermissionsAndroid, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BluetoothDevice } from "../../services/BluetoothService";
import { useBluetooth } from "../../hooks/useBluetooth";

interface DeviceListProps {
    selectDevice: (device: BluetoothDevice) => void;
}

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

function DeviceList({ selectDevice }: DeviceListProps) {
    const bluetooth = useBluetooth();
    const [connectedDevices, setConnectedDevices] = useState<BluetoothDevice[]>([]);
    const [pairedDevices, setPairedDevices] = useState<BluetoothDevice[]>([]);
    const [newDevices, setNewDevices] = useState<BluetoothDevice[]>([]);

    useEffect(() => {
        async function getConnectedDevices() {
            try {
                const connected = await bluetooth.getConnectedDevices();
                setConnectedDevices(prevDevices => [...prevDevices, ...connected]);
            } catch (error: any) {
            }
        }

        async function getPairedDevices() {
            try {
                const bonded = await bluetooth.getBondedDevices();
                setPairedDevices(prevDevices => [...prevDevices, ...bonded]);
            } catch (error: any) {
            }
        }

        async function acceptConnections() {
            try {
                const device = await bluetooth.accept({ delimiter: "\r" });

                if (device)
                    selectDevice(device);

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

            const devices = await bluetooth.startDiscovery();
            setNewDevices(prevDevices => [...prevDevices, ...devices]);
        } catch (error: any) {
        }
    }

    console.log(pairedDevices);
    console.log(connectedDevices);
    console.log(newDevices);

    return (
        <View>
            <ScrollView>
                <View>
                    {pairedDevices.map((device: BluetoothDevice, i: number) => {
                        return (
                            <TouchableOpacity
                                key={"device-" + i}
                                onPress={() => selectDevice(device)}>
                                <Text>{device.name}</Text>
                                <Text>{device.address}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

export default DeviceList;
