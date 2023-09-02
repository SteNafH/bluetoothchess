import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import BluetoothService from "../services/BluetoothService";

export const BluetoothContext =
    React.createContext<boolean>(false);

export function BluetoothProvider({ children }: { children: React.ReactNode }) {
    const [bluetoothEnabled, setBluetoothEnabled] = useState<boolean>();

    useEffect(() => {
        BluetoothService.isBluetoothEnabled()
            .then(enabled => {
                setBluetoothEnabled(enabled);
            })
            .catch(() => {
                setBluetoothEnabled(false);
            });

        BluetoothService.onBluetoothDisabled(async () => {
            await BluetoothService.cancelAccept()
                .catch(() => {
                });
            await BluetoothService.cancelDiscovery()
                .catch(() => {
                });

            setBluetoothEnabled(false);
        });

        BluetoothService.onBluetoothEnabled(() => {
            setBluetoothEnabled(true);
        });
    }, []);

    async function enableBluetooth() {
        const enabled = await BluetoothService.requestBluetoothEnabled()
            .catch(() => false);

        setBluetoothEnabled(enabled);
    }

    return (
        <BluetoothContext.Provider value={bluetoothEnabled ?? false}>
            <Modal animationType={"slide"} visible={bluetoothEnabled === false} transparent={true}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.header}>
                            Bluetooth staat uit!
                        </Text>
                        <Text style={styles.body}>
                            Je moet Bluetooth aanzetten om deze applicatie te kunnen gebruiken
                        </Text>
                        <Pressable style={styles.button} onPress={enableBluetooth}>
                            <Text style={styles.buttonText}>Bluetooth aanzetten</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {bluetoothEnabled === undefined ? null : children}
        </BluetoothContext.Provider>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        gap: 10,
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginTop: 10,
        backgroundColor: "#2196F3"
    },
    buttonText: {
        color: "#FFFFFF",
        textAlign: "center"
    },
    header: {
        color: "#1C1C1E",
        fontSize: 20,
        fontWeight: "bold"
    },
    body: {
        color: "#1C1C1E",
        textAlign: "center"
    },
});
