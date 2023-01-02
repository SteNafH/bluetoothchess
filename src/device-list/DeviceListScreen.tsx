import React from 'react';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
import { PermissionsAndroid, View, Text, Platform, TouchableOpacity, ScrollView } from 'react-native';

const requestAccessFineLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Access fine location required for discovery',
        message: 'In order to perform discovery, you must enable/allow ' + 'fine location access.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
    });
    return granted === PermissionsAndroid.RESULTS.GRANTED;
};

// interface Section {
//     title?: string;
//     data: readonly any[];
// }

interface Props {
    bluetoothEnabled: boolean;
    selectDevice: (device: BluetoothDevice) => void;
}

interface State {
    devices: BluetoothDevice[];
    accepting: boolean;
    discovering: boolean;
}

export default class DeviceListScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            devices: [],
            accepting: false,
            discovering: false,
        };
    }

    async componentDidMount() {
        await this.getBondedDevices();
    }

    async componentWillUnmount() {
        if (this.state.accepting) {
            await this.cancelAcceptConnections();
        }

        if (this.state.discovering) {
            await this.cancelDiscovery();
        }
    }

    async getBondedDevices(unloading?: boolean): Promise<void> {
        try {
            let bonded = await RNBluetoothClassic.getBondedDevices();
            // console.log('DeviceListScreen::getBondedDevices found', bonded);

            if (!unloading) {
                this.setState({ devices: bonded });
            }
        } catch (error) {
            this.setState({ devices: [] });

            console.log(error);
        }
    }

    async acceptConnections(): Promise<void> {
        if (this.state.accepting) {
            // console.log('Already accepting connections');
            return;
        }

        this.setState({ accepting: true });

        try {
            let device = await RNBluetoothClassic.accept({ delimiter: '\r' });
            if (device) {
                this.props.selectDevice(device);
            }
        } catch (error) {
            if (!this.state.accepting) {
                console.log('Attempt to accept connection failed.');
            }
        } finally {
            this.setState({ accepting: false });
        }
    }

    async cancelAcceptConnections(): Promise<void> {
        if (!this.state.accepting) {
            return;
        }

        try {
            let cancelled = await RNBluetoothClassic.cancelAccept();
            this.setState({ accepting: !cancelled });
        } catch (error) {
            console.log('Unable to cancel accept connection');
        }
    }

    async startDiscovery(): Promise<void> {
        try {
            let granted = await requestAccessFineLocationPermission();

            if (!granted) {
                throw new Error('Access fine location was not granted');
            }

            this.setState({ discovering: true });

            let devices = [...this.state.devices];

            try {
                let unpaired = await RNBluetoothClassic.startDiscovery();

                let index = devices.findIndex(d => !d.bonded);
                if (index >= 0) {
                    devices.splice(index, devices.length - index, ...unpaired);
                } else {
                    devices.push(...unpaired);
                }

                // console.log(`Found ${unpaired.length} unpaired devices.`);
            } finally {
                this.setState({ devices, discovering: false });
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    async cancelDiscovery(): Promise<void> {
        try {
            await RNBluetoothClassic.cancelDiscovery();
        } catch (error) {
            console.log('Error occurred while attempting to cancel discover devices');
        }
    }

    // getFormattedDevices(): Section[] {
    //     let formattedDevices: Map<string, Section> = new Map();
    //
    //     for (let device of this.state.devices as BluetoothDevice[]) {
    //         console.log(device);
    //     }
    //
    //     return Array.from(formattedDevices.values());
    // }

    render() {
        if (!this.props.bluetoothEnabled) {
            return (
                <View className={'flex-1 items-center justify-center'}>
                    <Text>Bluetooth is OFF</Text>
                </View>
            );
        }

        let toggleAccept = this.state.accepting ? () => this.cancelAcceptConnections() : () => this.acceptConnections();
        let toggleDiscovery = this.state.discovering ? () => this.cancelDiscovery() : () => this.startDiscovery();

        return (
            <View className={'flex-1 justify-between'}>
                <ScrollView className={'flex-1'}>
                    <View>
                        {this.state.devices.map((device: BluetoothDevice, i: number) => {
                            return (
                                <TouchableOpacity
                                    key={'device-' + i}
                                    className={'p-2'}
                                    onPress={() => this.props.selectDevice(device)}
                                >
                                    <Text>{device.name}</Text>
                                    <Text>{device.address}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
                {Platform.OS !== 'ios' && (
                    <View className={'w-full'}>
                        <TouchableOpacity onPress={toggleAccept}>
                            <Text className={'py-3 w-full text-center uppercase text-white bg-indigo-600'}>
                                {this.state.accepting ? 'Accepting (cancel)...' : 'Accept Connection'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleDiscovery}>
                            <Text className={'py-3 w-full text-center uppercase text-white bg-indigo-600'}>
                                {this.state.discovering ? 'Discovering (cancel)...' : 'Discover Devices'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }
}
