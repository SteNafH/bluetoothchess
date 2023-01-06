import React from 'react';
import RNBluetoothClassic, {
    BluetoothDevice,
    BluetoothDeviceReadEvent,
    BluetoothEventSubscription,
} from 'react-native-bluetooth-classic';
import { FlatList, View, Text, StyleSheet, TextInput, TouchableOpacity, BackHandler } from 'react-native';

interface Message {
    data?: string;
    timestamp: Date;
    type: string;
}

interface Props {
    device: BluetoothDevice;
    onBack: () => boolean;
}

interface State {
    text?: string;
    data: Message[];
    connection: boolean;
}

export default class DeviceScreen extends React.Component<Props, State> {
    private disconnectSubscription?: BluetoothEventSubscription;
    private readSubscription?: BluetoothEventSubscription;

    public constructor(props: Props) {
        super(props);

        this.state = {
            text: undefined,
            data: [],
            connection: false,
        };
    }

    public async componentWillUnmount(): Promise<void> {
        if (this.state.connection) {
            try {
                await this.props.device.disconnect();
            } catch (error) {
                // Unable to disconnect from device
            }
        }

        this.uninitializeRead();
        BackHandler.removeEventListener('hardwareBackPress', this.props.onBack);
    }

    public async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.props.onBack);
        await this.connect();
    }

    private async connect(): Promise<void> {
        try {
            let connection = await this.props.device.isConnected();

            if (!connection) {
                await this.addData({
                    data: `Attempting connection to ${this.props.device.address}`,
                    timestamp: new Date(),
                    type: 'error',
                });

                connection = await this.props.device.connect({ delimiter: '\r' });

                await this.addData({
                    data: 'Connection successful',
                    timestamp: new Date(),
                    type: 'info',
                });
            } else {
                await this.addData({
                    data: `Connected to ${this.props.device.address}`,
                    timestamp: new Date(),
                    type: 'error',
                });
            }

            this.setState({ connection: connection });
            this.initializeRead();
        } catch (error) {
            await this.addData({
                data: `Connection failed: ${error.message}`,
                timestamp: new Date(),
                type: 'error',
            });
        }
    }

    private async disconnect(disconnected: boolean): Promise<void> {
        try {
            if (!disconnected) {
                disconnected = await this.props.device.disconnect();
            }

            await this.addData({
                data: 'Disconnected',
                timestamp: new Date(),
                type: 'info',
            });

            this.setState({ connection: !disconnected });
        } catch (error) {
            await this.addData({
                data: `Disconnect failed: ${error.message}`,
                timestamp: new Date(),
                type: 'error',
            });
        }

        // Clear the reads, so that they don't get duplicated
        this.uninitializeRead();
    }

    private initializeRead(): void {
        this.disconnectSubscription = RNBluetoothClassic.onDeviceDisconnected(() => this.disconnect(true));
        this.readSubscription = this.props.device.onDataReceived((data: BluetoothDeviceReadEvent) => this.onReceivedData(data));
    }

    private uninitializeRead(): void {
        if (this.readSubscription) {
            this.readSubscription.remove();
        }
    }

    private async onReceivedData(event: BluetoothDeviceReadEvent) {
        console.log(event.data);

        await this.addData({
            ...event,
            timestamp: new Date(),
            type: 'receive',
        });
    }

    private async addData(message: Message) {
        this.setState({ data: [message, ...this.state.data] });
    }

    private async sendData() {
        try {
            let message = this.state.text + '\r';
            console.log(message);

            await RNBluetoothClassic.writeToDevice(this.props.device.address, message);

            await this.addData({
                timestamp: new Date(),
                data: this.state.text,
                type: 'sent',
            });

            this.setState({ text: undefined });
        } catch (error) {
            console.log(error);
        }
    }

    private async toggleConnection() {
        if (this.state.connection) {
            await this.disconnect(false);
        } else {
            await this.connect();
        }
    }

    public render() {
        return (
            <View style={styles.connectionScreenWrapper}>
                <FlatList
                    style={styles.connectionScreenOutput}
                    contentContainerStyle={{ justifyContent: 'flex-end' }}
                    inverted
                    data={this.state.data}
                    keyExtractor={item => item.timestamp.toISOString()}
                    renderItem={({ item }) => (
                        <View className={'flex-row justify-start'} key={'message-' + item.timestamp.toISOString()}>
                            <Text>{item.timestamp.toLocaleDateString()}</Text>
                            <Text>{item.type === 'sent' ? ' < ' : ' > '}</Text>
                            <Text className={'shrink-1'}>{item.data?.trim()}</Text>
                        </View>
                    )}
                />
                <InputArea
                    text={this.state.text}
                    onChangeText={(text: string) => this.setState({ text })}
                    onSend={() => this.sendData()}
                    disabled={!this.state.connection}
                />
            </View>
        );
    }
}

class InputArea extends React.Component<any, any> {
    render() {
        let style = this.props.disabled ? styles.inputArea : styles.inputAreaConnected;

        return (
            <View style={style}>
                <TextInput
                    style={styles.inputAreaTextInput}
                    placeholder={'Command/Text'}
                    value={this.props.text}
                    onChangeText={this.props.onChangeText}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onSubmitEditing={this.props.onSend}
                    returnKeyType={'send'}
                />
                <TouchableOpacity
                    style={styles.inputAreaSendButton}
                    onPress={this.props.onSend}
                    disabled={this.props.disabled}
                >
                    <Text>Send</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

/**
 * TextInput and Button for sending
 */
const styles = StyleSheet.create({
    connectionScreenWrapper: {
        flex: 1,
    },
    connectionScreenOutput: {
        flex: 1,
        paddingHorizontal: 8,
    },
    inputArea: {
        flexDirection: 'row',
        alignContent: 'stretch',
        backgroundColor: '#ccc',
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    inputAreaConnected: {
        flexDirection: 'row',
        alignContent: 'stretch',
        backgroundColor: '#90EE90',
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    inputAreaTextInput: {
        flex: 1,
        height: 40,
    },
    inputAreaSendButton: {
        justifyContent: 'center',
        flexShrink: 1,
    },
});
