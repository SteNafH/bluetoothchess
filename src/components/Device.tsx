import { Pressable, StyleSheet, Text, View } from "react-native";
import DeviceIcon from "./DeviceIcon";
import React from "react";
import { BluetoothDevice } from "react-native-bluetooth-classic";
import { ChallengeIcon } from "../icons";

interface DeviceProps {
    device: BluetoothDevice;
    onChallenge: (device: BluetoothDevice) => void;
}

function Device({ device, onChallenge }: DeviceProps) {
    function handleChallenge() {
        onChallenge(device);
    }

    return (
        <View
            style={styles.device}>
            <View style={styles.deviceIcon}>
                <DeviceIcon deviceClass={device.deviceClass} height={30} width={30} color={"#FFFFFF"} />
            </View>
            <View>
                <Text
                    style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceAddress}>{device.address}</Text>
            </View>
            <View style={styles.deviceChallengeContainer}>
                <Pressable onPress={handleChallenge} style={styles.deviceChallenge}>
                    <ChallengeIcon width={30} height={30} color={"#FFFFFF"} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    device: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 20,
        paddingVertical: 10
    },
    deviceIcon: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#252422"
    },
    deviceName: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold"
    },
    deviceAddress: {
        color: "#82817F",
        fontSize: 14,
        fontWeight: "bold"
    },
    deviceChallengeContainer: {
        display: "flex",
        flexDirection: "row",
        height: "100%",
        marginLeft: "auto",
        alignItems: "center"
    },
    deviceChallenge: {
        backgroundColor: "#85AA4B",
        padding: 5,
        borderRadius: 70 / 2
    }
});


export default Device;
