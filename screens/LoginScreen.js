import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Api from '../api';

export default function LoginScreen({ navigation, setIsAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please fill in both fields.'
            });
            return;
        }

        try {
            // const response = await fetch('http://127.0.0.1:8000/api/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Accept': 'application/json',
            //     },
            //     body: JSON.stringify({ email, password }),
            // });
            // const json = await response.json();

            const { response, json } = await Api.post('login', {
                email, password
            });

            if (response.ok) {
                await AsyncStorage.setItem('token', json.token);
                setIsAuthenticated(true);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            } else {
                // If Laravel sends detailed validation errors
                let message = json.message;
                if (json.errors) {
                    const firstError = Object.values(json.errors)[0][0];
                    message = firstError;
                }

                Toast.show({
                    type: 'error',
                    text1: 'Login Failed',
                    text2: message
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
            <View style={styles.registerBtn}>
                <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 },
    registerBtn: { marginTop: 10 },
});
