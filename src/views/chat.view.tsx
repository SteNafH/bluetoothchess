import React from 'react';
import {Button, FlatList, Text, View} from 'react-native';

interface Props {
    messages: string[];
    onSendMessage: () => void;
}

function Chat({messages, onSendMessage}: Props) {
    return (
        <View>
            <FlatList
                data={messages}
                renderItem={({item}) => <Text>{item}</Text>}
            />
            <Button title="Send Message" onPress={onSendMessage}/>
        </View>
    );
}

export default Chat;