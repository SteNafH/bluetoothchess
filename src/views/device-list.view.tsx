import React from 'react';
import {Button, FlatList, Text, View} from 'react-native';
import type {BluetoothDevice} from "react-native-bluetooth-classic";

interface Props {
    devices: BluetoothDevice[];
    onDeviceSelected: (device: string) => void;
}

function DeviceList({devices, onDeviceSelected}: Props) {
    return (
        <View>
            <Text>Available Devices:</Text>
            <FlatList
                data={devices}
                renderItem={({item}) => (
                    <Button title={item.name} onPress={() => onDeviceSelected(item.id)}/>
                )}
            />
        </View>
    );
}

export default DeviceList;