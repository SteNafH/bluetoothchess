import React from "react";
import Headphones from "../icons/headphones.svg";
import Laptop from "../icons/laptop.svg";
import Mobile from "../icons/mobile.svg";
import Question from "../icons/question.svg";
import { SvgProps } from "react-native-svg";

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
        return <Question {...props} />;

    switch (props.deviceClass.majorClass) {
        case MajorDevice.AUDIO_VIDEO:
            return <Headphones {...props} />;
        case MajorDevice.COMPUTER:
            return <Laptop {...props} />;
        case MajorDevice.PHONE:
            return <Mobile {...props} />;
        default:
            return <Question {...props} />;
    }
}

export default DeviceIcon;
