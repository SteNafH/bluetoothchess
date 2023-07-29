import React from "react";
import BluetoothService from "../services/BluetoothService";

export const BluetoothContext =
    React.createContext<typeof BluetoothService>(BluetoothService);
