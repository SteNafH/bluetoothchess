import React, { useEffect, useState } from "react";
import {
    BluetoothDevice,
    BluetoothEventSubscription
} from "react-native-bluetooth-classic";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import BluetoothService from "../services/BluetoothService";

function Game({ route }: StackScreenProps<RootStackParamList, "Game">) {
    const device = new BluetoothDevice(route.params.device, BluetoothService);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<string[]>([]);
    const [connection, setConnection] = useState<boolean>(false);
    const [readSubscription, setReadSubscription] =
        useState<BluetoothEventSubscription>();

    useEffect(() => {
        async function connect() {
            try {
                let connection = await device.isConnected();

                if (!connection) {
                    setMessages([
                        ...messages,
                        `Attempting connection to ${device.address}`
                    ]);

                    connection = await device.connect({ delimiter: "\r" });
                }

                setMessages(prevMessages => [
                    ...prevMessages,
                    `Connected to ${device.address}`
                ]);

                setConnection(connection);
                initializeRead();
            } catch (error: any) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    `Connection failed: ${error.message}`
                ]);
            }
        }

        async function disconnect() {
            if (connection)
                await device.disconnect();

            uninitializeRead();
        }

        void connect();

        return () => {
            void disconnect();
        };
    }, []);

    function uninitializeRead() {
        if (readSubscription)
            readSubscription.remove();
    }

    function initializeRead() {
        const readSubscription = device.onDataReceived(data =>
            setMessages(prevMessages => [...prevMessages, data.data])
        );

        setReadSubscription(readSubscription);
    }

    async function sendMessage() {
        try {
            await device.write(`${message}\r`);

            setMessages(prevMessages => [...prevMessages, message]);
            setMessage("");
        } catch (error: any) {
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.gameContainer}>
                <View style={styles.playerContainer}>
                    <Text>{device.name}</Text>
                </View>

                <View style={styles.board}></View>

                <View style={styles.playerContainer}>
                    <Text>Ik</Text>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <Text>Annuleren</Text>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    gameContainer: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 10
    },
    bottomContainer: {
        backgroundColor: "red"
    },
    board: {
        backgroundColor: "orange",
        width: "100%",
        aspectRatio: 1
    },
    playerContainer: {
        paddingHorizontal: 20,
        backgroundColor: "pink"
    }
});

export default Game;
