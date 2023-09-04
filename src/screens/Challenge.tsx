import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { BlitzIcon, BulletIcon, RapidIcon } from "../icons";

function Challenge() {
    const [timeControl, setTimeControl] = useState<string>("10 | 0");
    const [color, setColor] = useState<boolean>();

    function handleTimeControl(control: string) {
        setTimeControl(control);
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
                        <TimeControlButton control={"1 min"} selected={timeControl === "1 min"}
                                           onPress={handleTimeControl} />
                        <TimeControlButton control={"1 | 1"} selected={timeControl === "1 | 1"}
                                           onPress={handleTimeControl} />
                        <TimeControlButton control={"2 | 1"} selected={timeControl === "2 | 1"}
                                           onPress={handleTimeControl} />
                    </View>
                </View>
                <View style={styles.timeControlContainer}>
                    <View style={styles.timeControlHeader}>
                        <BlitzIcon width={25} height={25} color={"#FAD541"} />
                        <Text>Snelschaak</Text>
                    </View>
                    <View style={styles.timeControlBody}>
                        <TimeControlButton control={"3 min"} selected={timeControl === "3 min"}
                                           onPress={handleTimeControl} />
                        <TimeControlButton control={"3 | 2"} selected={timeControl === "3 | 2"}
                                           onPress={handleTimeControl} />
                        <TimeControlButton control={"5 min"} selected={timeControl === "5 min"}
                                           onPress={handleTimeControl} />
                    </View>
                </View>
                <View style={styles.timeControlContainer}>
                    <View style={styles.timeControlHeader}>
                        <RapidIcon width={25} height={25} color={"#81B64C"} />
                        <Text>Snel</Text>
                    </View>
                    <View style={styles.timeControlBody}>
                        <TimeControlButton control={"10 min"} selected={timeControl === "10 min"}
                                           onPress={handleTimeControl} />
                        <TimeControlButton control={"15 | 10"} selected={timeControl === "15 | 10"}
                                           onPress={handleTimeControl} />
                        <TimeControlButton control={"30 min"} selected={timeControl === "30 min"}
                                           onPress={handleTimeControl} />
                    </View>
                </View>

                <View style={styles.colorPickContainer}>
                    <Text>Ik speel als</Text>
                    <View>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

interface TimeControlButtonProps {
    selected: boolean;
    control: string;
    onPress: (control: string) => void;
}

function TimeControlButton({ selected, control, onPress }: TimeControlButtonProps) {
    function handlePress() {
        onPress(control);
    }

    return (
        <Pressable style={{ ...styles.timeControlButton, ...(selected ? styles.timeControlButtonActive : {}) }}
                   onPress={handlePress}>
            <Text style={styles.timeControlButtonText}>{control}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1
    },
    scrollView: {
        paddingHorizontal: 20,
        flexGrow: 1
    },
    timeControlContainer: {
        marginTop: 20,
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
    timeControlButtonActive: {
        borderColor: "#85AA4B"
    },
    timeControlButtonText: {
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold"
    },
    colorPickContainer: {
        marginTop: 20,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: "#252422",
        paddingVertical: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
});

export default Challenge;
