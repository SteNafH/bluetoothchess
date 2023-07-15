import React, {useState} from 'react';
import {View} from 'react-native';
import {BluetoothDevice} from './services/BluetoothService';
import Chat from './pages/chat/Chat';
import DeviceList from './pages/device-list/DeviceList';

function App() {
  const [device, setDevice] = useState<BluetoothDevice>();

  function selectDevice(device: BluetoothDevice) {
    setDevice(device);
  }

  return (
    <View>
      {!device ? (
        <DeviceList selectDevice={selectDevice} />
      ) : (
        <Chat device={device} />
      )}
    </View>
  );
}
export default App;
