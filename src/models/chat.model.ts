import RNBluetoothClassic, {
    BluetoothEventSubscription,
} from 'react-native-bluetooth-classic';

class ChatModel {
    /**
     * @throws {BLUETOOTH_NOT_ENABLED, NOT_CURRENTLY_CONNECTED, WRITE_FAILED}
     */
    public async sendMessage(address: string, message: string): Promise<boolean> {
        message = message + '\r';
        return await RNBluetoothClassic.writeToDevice(address, message);
    }

    /**
     * @throws {InvalidBluetoothEventException, IllegalStateException}
     */
    public onReceiveMessage(address: string, callback: (message: string) => void): BluetoothEventSubscription {
        return RNBluetoothClassic.onDeviceRead(address, ({ data }) => {
            callback(data);
        });
    }
}

export default new ChatModel();