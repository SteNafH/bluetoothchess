import React from "react";
import { BluetoothContext } from "../contexts/BluetoothContext";

export function useBluetooth() {
    return React.useContext(BluetoothContext);
}
