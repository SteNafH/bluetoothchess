import React from "react";
import { StyleSheet, Text, View } from "react-native";

function Challenge() {
    return (
        <View style={styles.container}>
            <Text>Challenge</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    }
});

export default Challenge;
