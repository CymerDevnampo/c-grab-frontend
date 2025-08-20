import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';
import Api from '../api';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const fetchAuthenticatedUser = async () => {
        try {
            const { response, json } = await Api.get('get/profile');

            if (response.ok) {
                setUser(json);
                setName(json.name);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: json.message || 'Failed to load profile',
                });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthenticatedUser();
    }, []);

    const handleSelectPhoto = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                const selectedImage = result.assets[0];
                console.log('Selected image:', selectedImage);

                try {
                    setAvatarLoading(true);

                    const base64Data = selectedImage.uri.split(',')[1];

                    const { response: res, json } = await Api.post('update/profile', {
                        avatar_base64: base64Data,
                        avatar_name: selectedImage.name || 'avatar.png',
                        avatar_mime: selectedImage.mimeType || 'image/png',
                    });

                    console.log('Response:', json);

                    if (res.ok) {
                        Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: 'Avatar updated successfully',
                        });
                        setUser(prev => ({ ...prev, avatar: json.avatar }));
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: json.message || 'Failed to update avatar',
                        });
                    }
                } catch (error) {
                    console.error('Upload error:', error);
                    Toast.show({ type: 'error', text1: 'Error', text2: error.message });
                } finally {
                    setAvatarLoading(false);
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to select image'
            });
        }
    };

    const handleSaveName = async () => {
        if (!name || name.trim().length < 2) {
            Toast.show({ type: 'error', text1: 'Invalid Name', text2: 'Name must be at least 2 characters.' });
            return;
        }

        try {
            setSaving(true);
            const { response: res, json } = await Api.post('update/profile', { name });

            if (res.ok) {
                Toast.show({ type: 'success', text1: 'Updated', text2: 'Name updated successfully' });
                setUser(prev => ({ ...prev, name }));
            } else {
                Toast.show({ type: 'error', text1: 'Error', text2: json.message || 'Failed to update name' });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleSelectPhoto}>
                <View style={styles.avatarWrapper}>
                    <Image
                        source={
                            user?.avatar
                                ? { uri: `${Api.baseUrl}/storage/avatars/${user.avatar}` }
                                : require('../assets/avatars/avatar1.png')
                        }
                        style={styles.avatar}
                    />
                    {avatarLoading && (
                        <View style={styles.avatarOverlay}>
                            <ActivityIndicator color="#fff" />
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            <View style={styles.emailContainer}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter name"
                    style={styles.input}
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}>
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Icon name="save" size={18} color="#fff" />
                            <Text style={styles.saveText}>Save</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarWrapper: {
        alignSelf: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: '#eee',
    },
    avatarOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fieldContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
    },
    saveButton: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007bff',
        paddingVertical: 10,
        borderRadius: 8,
    },
    saveText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 6,
    },
    emailContainer: {
        marginTop: 20,
    },
    email: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
});