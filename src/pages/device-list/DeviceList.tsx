import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import BluetoothService, {
  BluetoothDevice,
} from '../../services/BluetoothService';

interface DeviceListProps {
  selectDevice: (device: BluetoothDevice) => void;
}

function DeviceList({selectDevice}: DeviceListProps) {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);

  useEffect(() => {
    async function getBondedDevices() {
      try {
        const bonded = await BluetoothService.getBondedDevices();
        setDevices([...devices, ...bonded]);
      } catch (error: any) {}
    }

    void getBondedDevices();
  }, []);

  return (
    <View>
      <ScrollView>
        <View>
          {devices.map((device: BluetoothDevice, i: number) => {
            return (
              <TouchableOpacity
                key={'device-' + i}
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
