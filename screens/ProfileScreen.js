import React from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ setIsAuthenticated }) {
    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Profile Screen</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
}
