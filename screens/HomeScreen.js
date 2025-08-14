import React from 'react';
import { ScrollView, View, StyleSheet, Text as RNText } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';

const cancelBtn = () => alert('Cancel');
const okBtn = () => alert('Ok');

export default function HomeScreen() {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <RNText style={styles.text}>Welcome Home!</RNText>

            <View style={styles.grid}>
                {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
                    <Card key={index} style={styles.card}>
                        <Card.Title title={`Card ${item}`} subtitle="Card Subtitle" />
                        <Card.Content>
                            <Text variant="titleLarge">Card title</Text>
                            <Text variant="bodyMedium">Card content</Text>
                        </Card.Content>
                        <Card.Cover source={{ uri: 'https://picsum.photos/200' }} />
                        <Card.Actions>
                            <Button onPress={cancelBtn}>Cancel</Button>
                            <Button onPress={okBtn}>Ok</Button>
                        </Card.Actions>
                    </Card>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 10
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    card: {
        width: '48%', // 2 columns with space
        marginBottom: 10
    }
});
