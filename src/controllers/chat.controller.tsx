import React, {useState, useEffect} from 'react';
import BluetoothModel from '../models/bluetooth.model';
import ChatModel from '../models/chat.model';
import Chat from '../views/chat.view';
import type {BluetoothDevice} from "react-native-bluetooth-classic";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

function ChatController({route}: Props) {
    const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice>();
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        BluetoothModel.connectToDevice(route.params.deviceId)
            .then((device) => {
                setConnectedDevice(device);

                ChatModel.onReceiveMessage(device.id, (message) => {
                    setMessages([...messages, message]);
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    async function handleSendMessage() {
        if (!connectedDevice)
            return;

        try {
            await ChatModel.sendMessage(connectedDevice.id, 'Test message');
            setMessages([...messages, 'Test message']);
        } catch (error) {
            console.log(error);
        }
    }

    return <Chat messages={messages} onSendMessage={handleSendMessage}/>;
}

export default ChatController;
