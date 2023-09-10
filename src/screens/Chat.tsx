import React, { useEffect, useState } from "react";
import {
    BluetoothDevice,
    BluetoothEventSubscription
} from "react-native-bluetooth-classic";
import { Button, Text, TextInput, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import BluetoothService from "../services/BluetoothService";

function Chat({ route }: StackScreenProps<RootStackParamList, "Device">) {
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
        <View>
            <Text>Chat Room</Text>
            {messages.map((message, index) => (
                <View key={index}>
                    <Text>{message}</Text>
                </View>
            ))}
            <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
}

export default Chat;
