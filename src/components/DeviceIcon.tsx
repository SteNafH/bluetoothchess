import React from "react";
import { SvgProps } from "react-native-svg";
import { HeadphonesIcon, LaptopIcon, MobileIcon, QuestionIcon } from "../icons";

const MajorDevice = {
    AUDIO_VIDEO: 1024,
    COMPUTER: 256,
    HEALTH: 2304,
    IMAGING: 1536,
    MISC: 0,
    NETWORKING: 768,
    PERIPHERAL: 1280,
    PHONE: 512,
    TOY: 2048,
    UNCATEGORIZED: 7936,
    WEARABLE: 1792
};

interface DeviceIconProps extends SvgProps {
    deviceClass: { deviceClass: number; majorClass: number; } | string | undefined;
}

function DeviceIcon(props: DeviceIconProps) {
    if (!props.deviceClass || typeof props.deviceClass === "string")
        return <QuestionIcon {...props} />;

    switch (props.deviceClass.majorClass) {
        case MajorDevice.AUDIO_VIDEO:
            return <HeadphonesIcon {...props} />;
        case MajorDevice.COMPUTER:
            return <LaptopIcon {...props} />;
        case MajorDevice.PHONE:
            return <MobileIcon {...props} />;
        default:
            return <QuestionIcon {...props} />;
    }
}

export default DeviceIcon;
