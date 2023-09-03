import React from "react";
import { BluetoothContext } from "../contexts/BluetoothContext";

function useBluetooth() {
    return React.useContext(BluetoothContext);
}

export {
    useBluetooth
};
