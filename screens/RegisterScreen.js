import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import Api from '../api';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            // let response = await fetch("http://192.168.1.24:1000/api/register", {
            //     method: 'POST',
            //     headers: {
            //         "Content-Type": "application/json",
            //         'Accept': 'application/json',
            //     },
            //     body: JSON.stringify({ name, email, password })
            // });
            // let json = await response.json();

            const { response, json } = await Api.post('register', {
                name, email, password
            });

            if (response.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Registration Successful',
                    // text2: json.message,
                    text2: "You can now login",
                });
                navigation.navigate("Login");
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Login Failed',
                    text2: json.errors.email[0],
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error.message,
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
            <Text>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} />
            <Text>Password</Text>
            <TextInput style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
            <Button title="Register" onPress={handleRegister} />
            <View style={styles.goToLoginBtn}>
                <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10 },
    goToLoginBtn: { marginTop: 10 },
});
