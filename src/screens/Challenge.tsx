import React, { ReactNode, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BlitzIcon, BulletIcon, KingIcon, QuestionIcon, RapidIcon } from "../icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";

function Challenge({ route }: StackScreenProps<RootStackParamList, "Challenge">) {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [timeControl, setTimeControl] = useState<string>("10 min");
    const [color, setColor] = useState<boolean>();

    function handleTimeControl(control: string) {
        setTimeControl(control);
    }

    function handleColor(color?: boolean) {
        setColor(color);
    }

    function handlePlay() {
        navigation.navigate("Device", { device: route.params.device, color, timeControl });
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.timeControlContainer}>
                    <View style={styles.timeControlHeader}>
                        <BulletIcon width={25} height={25} color={"#E3AA24"} />
                        <Text>Bullet</Text>
                    </View>
                    <View style={styles.timeControlBody}>
                        <TimeControlButton value={"1 min"} selected={timeControl === "1 min"}
                                           onPress={handleTimeControl} />
                        <TimeControlButton value={"1 | 1"} selected={timeControl === "1 | 1"}
                                           onPress={handleTimeControl} />
                        <TimeControlButton value={"2 | 1"} selected={timeControl === "2 | 1"}
                                           onPress={handleTimeControl} />
                    </View>
                </View>
                <View style={styles.timeControlContainer}>
                    <View style={styles.timeControlHeader}>
                        <BlitzIcon width={25} height={25} color={"#FAD541"} />
                        <Text>Snelschaak</Text>
                    </View>
                    <View style={styles.timeControlBody}>
                        <TimeControlButton value={"3 min"} selected={timeControl === "3 min"}
                                           onPress={handleTimeControl} />
                        <TimeControlButton value={"3 | 2"} selected={timeControl === "3 | 2"}
                                           onPress={handleTimeControl} />
                        <TimeControlButton value={"5 min"} selected={timeControl === "5 min"}
                                           onPress={handleTimeControl} />
                    </View>
                </View>
                <View style={styles.timeControlContainer}>
                    <View style={styles.timeControlHeader}>
                        <RapidIcon width={25} height={25} color={"#81B64C"} />
                        <Text>Snel</Text>
                    </View>
                    <View style={styles.timeControlBody}>
                        <TimeControlButton value={"10 min"} selected={timeControl === "10 min"}
                                           onPress={handleTimeControl} />
                        <TimeControlButton value={"15 | 10"} selected={timeControl === "15 | 10"}
                                           onPress={handleTimeControl} />
                        <TimeControlButton value={"30 min"} selected={timeControl === "30 min"}
                                           onPress={handleTimeControl} />
                    </View>
                </View>

                <View style={styles.colorPickContainer}>
                    <Text>Ik speel als</Text>
                    <View style={styles.colorPickButtonsContainer}>
                        <ColorButton value={true} selected={color === true} onPress={handleColor}>
                            <View style={{ backgroundColor: "#FFFFFF", padding: 8 }}>
                                <KingIcon width={30} height={30} color={"#000000"} />
                            </View>
                        </ColorButton>
                        <ColorButton value={undefined} selected={color === undefined} onPress={handleColor}>
                            <View style={{backgroundColor: "#FFFFFF", position: "absolute", left: 0, height: "100%", width: "50%"}}/>
                            <View style={{backgroundColor: "#000000", position: "absolute", right: 0, height: "100%", width: "50%"}}/>
                            <View style={{padding: 8}}>
                                <QuestionIcon width={30} height={30} color={"#FFFFFF"} stroke={"#000000"} strokeWidth={3} />
                            </View>
                        </ColorButton>
                        <ColorButton value={false} selected={color === false} onPress={handleColor}>
                            <View style={{ backgroundColor: "#000000", padding: 8 }}>
                                <KingIcon width={30} height={30} color={"#FFFFFF"} />
                            </View>
                        </ColorButton>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.playContainer}>
                <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
                    <Text style={styles.playText}>Spelen</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

type ButtonValue = boolean | string | number | null | undefined;

interface ButtonProps<T extends ButtonValue> {
    selected: boolean;
    value: T;
    onPress: (value: T) => void;
    children?: ReactNode;
}

function TimeControlButton<T extends ButtonValue>({ selected, value, onPress }: ButtonProps<T>) {
    function handlePress() {
        onPress(value);
    }

    return (
        <TouchableOpacity style={{ ...styles.timeControlButton, ...(selected ? styles.buttonActive : {}) }}
                          onPress={handlePress}>
            <Text style={styles.timeControlButtonText}>{value}</Text>
        </TouchableOpacity>
    );
}

function ColorButton<T extends ButtonValue>({ selected, value, onPress, children }: ButtonProps<T>) {
    function handlePress() {
        onPress(value);
    }

    return (
        <TouchableOpacity style={{ ...styles.colorButton, ...(selected ? styles.buttonActive : {}) }}
                          onPress={handlePress}>
            {children}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1
    },
    scrollView: {
        padding: 20,
        flexGrow: 1,
        gap: 20
    },
    timeControlContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 10
    },
    timeControlHeader: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    timeControlBody: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    timeControlButton: {
        flexGrow: 1 / 3,
        backgroundColor: "#464241",
        padding: 10,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#464241"
    },
    buttonActive: {
        borderColor: "#85AA4B"
    },
    timeControlButtonText: {
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold"
    },
    colorPickContainer: {
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: "#252422",
        paddingVertical: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    colorPickButtonsContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 5
    },
    colorButton: {
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "transparent",
        overflow: "hidden"
    },
    playContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#252422",
    },
    playButton: {
        backgroundColor: "#85AA4B",
        padding: 15,
        borderRadius: 8
    },
    playText: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 18,
        color: "#FFFFFF"
    }
});

export default Challenge;
