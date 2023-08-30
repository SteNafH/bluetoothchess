import { StyleSheet, Text, View } from "react-native";
import DeviceIcon from "./DeviceIcon";
import React from "react";
import { BluetoothDevice } from "react-native-bluetooth-classic";

interface DeviceProps {
    device: BluetoothDevice;
}

function Device({device}: DeviceProps) {
    return (
        <View
              style={styles.device}>
            <DeviceIcon deviceClass={device.deviceClass} height={30} width={30} />
            <View>
                <Text
                    style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceAddress}>{device.address}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    device: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 20
    },
    deviceName: {
        color: "#1c1c1e",
        fontSize: 16,
        fontWeight: "bold"
    },
    deviceAddress: {
        color: "#1c1c1e",
        fontSize: 14
    }
});


export default Device;
