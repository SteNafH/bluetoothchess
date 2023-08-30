import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
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
                .catch(() => {});
            await BluetoothService.cancelDiscovery()
                .catch(() => {});

            setBluetoothEnabled(false);
        });

        BluetoothService.onBluetoothEnabled(() => {
            setBluetoothEnabled(true);
        });
    }, []);

    return (
        <BluetoothContext.Provider value={bluetoothEnabled ?? false}>
            {bluetoothEnabled === false && (
                <View>
                    <Text>
                        Bluetooth Not Enabled
                    </Text>
                </View>
            )}
            {bluetoothEnabled === undefined ? null : children}
        </BluetoothContext.Provider>
    );
}
