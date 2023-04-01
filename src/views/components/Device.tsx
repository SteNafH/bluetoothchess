// import { BluetoothNativeDevice } from 'react-native-bluetooth-classic';
// import React from 'react';
// import { Text, TouchableOpacity, View } from 'react-native';
// import { MajorDevice } from '../../configs/major-device-class.config';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faBluetoothB } from '@fortawesome/free-brands-svg-icons';
// import { faChessBoard } from '@fortawesome/free-solid-svg-icons';
// import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
// import { faHeadphones, faLaptop, faMobileScreen, faWifi, faHeartPulse } from '@fortawesome/free-solid-svg-icons';
//
// interface DeviceItemProps {
//     device: BluetoothNativeDevice;
//     onPress: (device: BluetoothNativeDevice) => void;
// }
//
// export default class DeviceItem extends React.Component<DeviceItemProps, any> {
//     private onPress = (): void => {
//         this.props.onPress(this.props.device);
//     }
//
//     public render() {
//         return (
//             <View className={'flex-row gap-4 pt-3'}>
//                 <View className={'bg-primary rounded-2xl aspect-square items-center justify-center'} style={{ width: 72 }}>
//                     <DeviceIcon deviceClass={this.props.device.deviceClass}/>
//                 </View>
//                 <View
//                     className={'flex-1 flex-row'}>
//                     <View className={'flex-1'}>
//                         <Text className={'text-f-secondary font-bold'}>{this.props.device.name}</Text>
//                         <Text className={'text-f-tertiary font-bold'}>{this.props.device.address}</Text>
//                     </View>
//                     <View className={'justify-center'}>
//                         <TouchableOpacity onPress={this.onPress} className={'rounded-full aspect-square p-3 items-center'} style={{ backgroundColor: (this.props.device.bonded ? '#86A94B' : '#2678A6') }}>
//                             <FontAwesomeIcon color={'#FFFFFF'} icon={(this.props.device.bonded ? faChessBoard : faBluetoothB)}/>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>
//         );
//     }
// }
//
// interface DeviceIconProps {
//     deviceClass?: { deviceClass: number; majorClass: number; } | string;
// }
//
// class DeviceIcon extends React.Component<DeviceIconProps, any> {
//     render() {
//         if (!this.props.deviceClass || typeof this.props.deviceClass === 'string')
//             return <FontAwesomeIcon color={'#FFFFFF'} icon={faBluetoothB}/>;
//
//         let icon: IconDefinition;
//
//         switch (this.props.deviceClass.majorClass) {
//             case MajorDevice.AUDIO_VIDEO:
//                 icon = faHeadphones;
//                 break;
//             case MajorDevice.COMPUTER:
//                 icon = faLaptop;
//                 break;
//             case MajorDevice.HEALTH:
//                 icon = faHeartPulse;
//                 break;
//             case MajorDevice.NETWORKING:
//                 icon = faWifi;
//                 break;
//             case MajorDevice.PHONE:
//                 icon = faMobileScreen;
//                 break;
//             default:
//                 icon = faBluetoothB;
//                 break;
//         }
//
//         return <FontAwesomeIcon color={'#FFFFFF'} size={30} icon={icon}/>;
//     }
// }
