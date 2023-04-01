import RNBluetoothClassic, {
    BluetoothDevice,
} from 'react-native-bluetooth-classic';

class BluetoothModel {

    /**
     * @throws {BLUETOOTH_NOT_ENABLED}
     */
    public async getPairedDevices(): Promise<BluetoothDevice[]> {
        return await RNBluetoothClassic.getBondedDevices();
    }

    /**
     * @throws {BLUETOOTH_NOT_ENABLED, BLUETOOTH_IN_DISCOVERY, DISCOVERY_FAILED}
     */
    public async scanDevices(): Promise<BluetoothDevice[]> {
        return await RNBluetoothClassic.startDiscovery();
    }

    /**
     * @throws {BLUETOOTH_NOT_ENABLED, ALREADY_CONNECTING, INVALID_CONNECTOR_TYPE, INVALID_CONNECTION_TYPE, ConnectionFailedException}
     */
    public async connectToDevice(address: string): Promise<BluetoothDevice> {
        return await RNBluetoothClassic.connectToDevice(address, {delimiter: '\r'});
    }
}

export default new BluetoothModel();