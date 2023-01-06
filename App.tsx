import React from 'react';
import { View } from 'react-native';
import RNBluetoothClassic, { BluetoothDevice, BluetoothEventSubscription } from 'react-native-bluetooth-classic';

import DeviceListScreen from './src/device-list/DeviceListScreen';
import DeviceScreen from './src/device-screen/DeviceScreen';

interface Props {
}

interface State {
    bluetoothEnabled: boolean;
    device?: BluetoothDevice;
}

export default class App extends React.Component<Props, State> {
    private enabledSubscription?: BluetoothEventSubscription;
    private disabledSubscription?: BluetoothEventSubscription;

    public constructor(props: Props) {
        super(props);

        this.state = { bluetoothEnabled: true, device: undefined };
    }

    private selectDevice = (device: BluetoothDevice): void => {
        this.setState({ device: device });
    }

    private removeDevice = (): boolean => {
        this.setState({ device: undefined });
        return true;
    }

    public async componentDidMount() {
        // console.log('App::componentDidMount adding listeners: onBluetoothEnabled and onBluetoothDisabled');
        // console.log('App::componentDidMount alternatively could use onStateChanged');
        this.enabledSubscription = RNBluetoothClassic.onBluetoothEnabled(event => this.onStateChanged(event));
        await this.checkBluetoothEnabled();

        this.disabledSubscription = RNBluetoothClassic.onBluetoothDisabled(event => this.onStateChanged(event));
    }

    public async checkBluetoothEnabled(): Promise<void> {
        try {
            // console.log('App::componentDidMount Checking bluetooth status');
            let enabled: boolean = await RNBluetoothClassic.isBluetoothEnabled();

            // console.log(`App::componentDidMount Status: ${enabled}`);
            this.setState({ bluetoothEnabled: enabled });
        } catch (error) {
            console.log('App::componentDidMount Status Error: ', error);
            this.setState({ bluetoothEnabled: false });
        }
    }

    private onStateChanged(stateChangedEvent: any) {
        // console.log('App::onStateChanged event used for onBluetoothEnabled and onBluetoothDisabled');

        this.setState({ bluetoothEnabled: stateChangedEvent.enabled });
    }

    public render() {
        return (
            <View className={'flex-1'}>
                {!this.state.device ? (
                    <DeviceListScreen bluetoothEnabled={this.state.bluetoothEnabled} selectDevice={this.selectDevice}/>
                ) : (
                    <DeviceScreen device={this.state.device} onBack={this.removeDevice}/>
                )}
            </View>
        );
    }
}
