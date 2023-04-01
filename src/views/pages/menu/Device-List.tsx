// import React from 'react';
// import RNBluetoothClassic, { BluetoothNativeDevice } from 'react-native-bluetooth-classic';
// import {
//     PermissionsAndroid,
//     View,
//     Text,
//     TextInput,
//     ScrollView,
//     Platform,
//     TouchableOpacity,
// } from 'react-native';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faCircleNotch, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
// import DeviceItem from '../../components/Device';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../../../types';
//
// const requestAccessFineLocationPermission = async () => {
//     const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
//         title: 'Access fine location required for discovery',
//         message: 'In order to perform discovery, you must enable/allow ' + 'fine location access.',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//     });
//     return granted === PermissionsAndroid.RESULTS.GRANTED;
// };
//
// type Props = NativeStackScreenProps<RootStackParamList, 'Devices'>;
//
// interface Device {
//     [key: string]: BluetoothNativeDevice;
// }
//
// interface State {
//     bondedDevices: Device;
//     discoveredDevices: Device;
//     accepting: boolean;
//     discovering: boolean;
//     filter: string;
// }
//
// export default class DeviceList extends React.Component<Props, State> {
//     public constructor(props: Props) {
//         super(props);
//
//         this.state = {
//             bondedDevices: {},
//             discoveredDevices: {},
//             accepting: false,
//             discovering: false,
//             filter: '',
//         };
//
//         this.props.navigation.addListener('focus', async () => {
//             this.acceptConnections().then(null);
//             await this.startDiscovery();
//         });
//     }
//
//     public async componentDidMount() {
//         await this.getBondedDevices();
//
//         if (Platform.OS !== 'android')
//             return;
//
//         this.acceptConnections().then(null);
//         await this.startDiscovery();
//     }
//
//     public async componentWillUnmount() {
//         if (this.state.accepting)
//             await this.cancelAcceptConnections();
//
//         if (this.state.discovering)
//             await this.cancelDiscovery();
//     }
//
//     private async getBondedDevices(unloading?: boolean): Promise<void> {
//         try {
//             let bonded = await RNBluetoothClassic.getBondedDevices();
//             // console.log('DeviceList::getBondedDevices found', bonded);
//
//             if (!unloading)
//                 this.setState({ bondedDevices: this.getDevices(bonded) });
//         } catch (error) {
//             this.setState({ bondedDevices: { } });
//
//             console.log(error);
//         }
//     }
//
//     private async acceptConnections(): Promise<void> {
//         if (this.state.accepting)
//             return;
//
//         this.setState({ accepting: true });
//
//         try {
//             let device = await RNBluetoothClassic.accept({ delimiter: '\r' });
//             console.log(device);
//             if (device)
//                 this.selectDevice(device);
//         } catch (error) {
//             if (!this.state.accepting)
//                 console.log('Attempt to accept connection failed.');
//         } finally {
//             this.setState({ accepting: false });
//         }
//     }
//
//     private async cancelAcceptConnections(): Promise<void> {
//         if (!this.state.accepting)
//             return;
//
//         try {
//             let cancelled = await RNBluetoothClassic.cancelAccept();
//             this.setState({ accepting: !cancelled });
//         } catch (error) {
//             console.log('Unable to cancel accept connection');
//         }
//     }
//
//     private async startDiscovery(): Promise<void> {
//         try {
//             let granted = await requestAccessFineLocationPermission();
//
//             if (!granted)
//                 throw new Error('Access fine location was not granted');
//
//             this.setState({ discovering: true });
//
//             let devices: Device = {};
//
//             try {
//                 let unpaired = await RNBluetoothClassic.startDiscovery();
//                 devices = this.getDevices(unpaired.filter((device: BluetoothNativeDevice) => !device.bonded));
//             } finally {
//                 this.setState({ discoveredDevices: devices, discovering: false });
//             }
//         } catch (error) {
//             console.log(error.message);
//         }
//     }
//
//     private async cancelDiscovery(): Promise<void> {
//         try {
//             await RNBluetoothClassic.cancelDiscovery();
//         } catch (error) {
//             console.log('Error occurred while attempting to cancel discover devices');
//         }
//     }
//
//     private setFilter = (value: string): void => {
//         this.setState({ filter: value });
//     }
//
//     private selectDevice = (device: BluetoothNativeDevice): void => {
//         this.props.navigation.navigate('Device', { device: device });
//     }
//
//     private pairDevice = async (device: BluetoothNativeDevice): Promise<void> => {
//         let pairedDevice = await RNBluetoothClassic.pairDevice(device.address);
//         this.setState({ bondedDevices: { ...this.state.bondedDevices, ...{ [pairedDevice.id]: pairedDevice } } });
//     }
//
//     private getDevices = (devices: BluetoothNativeDevice[]): Device => {
//         let devicesObject: Device = {};
//
//         for (let device of devices)
//             devicesObject[device.id] = device;
//
//         return devicesObject;
//     }
//
//     public render() {
//         if (!this.props.route.params.bluetoothEnabled)
//             return <View className={'flex-1 items-center justify-center'}>
//                 <Text>Bluetooth is OFF</Text>
//             </View>;
//
//         // let toggleAccept = this.state.accepting ? () => this.cancelAcceptConnections() : () => this.acceptConnections();
//         let toggleDiscovery = this.state.discovering ? () => this.cancelDiscovery() : () => this.startDiscovery();
//
//         let filter = this.state.filter.toUpperCase();
//
//         let bondedDevices = Object.values(this.state.bondedDevices).filter((device: BluetoothNativeDevice) => device.name.toUpperCase().includes(filter));
//         let discoveredDevices = Object.values(this.state.discoveredDevices).filter((device: BluetoothNativeDevice) => device.name.toUpperCase().includes(filter));
//
//         return (
//             <View className={'flex-1'}>
//                 <View className={'flex-1 justify-between bg-secondary'}>
//                     <View className={'flex-row items-center bg-tertiary my-3 mx-4 px-4 rounded-lg'}>
//                         <FontAwesomeIcon color={'#9F9E9C'} icon={faMagnifyingGlass}/>
//                         <TextInput className={'flex-1 px-4 text-f-secondary font-bold'} value={this.state.filter} onChangeText={this.setFilter} placeholderTextColor={'#9F9E9C'} placeholder={'Zoek apparaat'}/>
//                     </View>
//                     <ScrollView className={'flex-1 px-4'}>
//                         <View className={'flex-1 gap-8 py-4'}>
//                             {bondedDevices.length > 0 && <View>
//                                 <View className={'flex-row items-center gap-2'}>
//                                     <Text className={'tracking-wide font-bold color-f-secondary'}>Gekoppelde apparaten</Text>
//                                     <Text
//                                         className={'bg-tertiary font-bold py-1 px-2 rounded-lg color-f-secondary'}>{bondedDevices.length}</Text>
//                                 </View>
//                                 {bondedDevices.map((device: BluetoothNativeDevice) => <DeviceItem key={device.address} onPress={this.selectDevice} device={device}/>)}
//                             </View>}
//                             <View>
//                                 <View className={'flex-row items-center justify-between'}>
//                                     <View className={'flex-row items-center gap-2'}>
//                                         <Text className={'tracking-wide font-bold color-f-secondary'}>Beschikbare apparaten</Text>
//                                         <Text className={'bg-tertiary font-bold py-1 px-2 rounded-lg color-f-secondary'}>{discoveredDevices.length}</Text>
//                                     </View>
//                                     <TouchableOpacity className={'bg-tertiary p-2 rounded-full'} onPress={toggleDiscovery}>
//                                         <FontAwesomeIcon icon={faCircleNotch} color={'#FFFFFF'}/>
//                                     </TouchableOpacity>
//                                 </View>
//                                 {discoveredDevices.map((device: BluetoothNativeDevice) => <DeviceItem key={device.address} onPress={this.pairDevice} device={device}/>)}
//                             </View>
//                         </View>
//                     </ScrollView>
//                 </View>
//             </View>
//         );
//     }
// }
