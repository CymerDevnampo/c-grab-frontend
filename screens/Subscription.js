import { ScrollView, StyleSheet, Alert, Modal, Pressable, View, TextInput, Image } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import Api from '../api';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'; // Add this import
import React, { useState, useEffect } from 'react';

export default function SubscriptionScreen() {
    // const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');

    const fetchAuthenticatedUsersPlanStatus = async () => {
        try {
            const { response, json } = await Api.get('get/user/subscription/status');

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
        fetchAuthenticatedUsersPlanStatus();
    }, []);

    const plans = [
        {
            id: '1',
            name: "Free",
            price: "₱0 / month",
            amount: 0,
            color: "#4CAF50", // green
            features: ["Basic Access", "Limited Features", "Community Support"],
        },
        {
            id: '2',
            name: "Standard",
            price: " ₱299 / month",
            amount: 299,
            color: "#2196F3", // blue
            features: ["Full Access", "Standard Features", "Email Support"],
        },
        {
            id: '3',
            name: "Premium",
            price: "₱399 / month",
            amount: 399,
            color: "#FFD700", // gold
            highlight: true,
            features: ["Unlimited Access", "All Features", "Priority Support"],
        },
    ];

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [referenceCode, setReferenceCode] = useState("");
    const [receipt, setReceipt] = useState(null);

    const handleChoosePlan = (plan) => {
        setSelectedPlan(plan);
        setModalVisible(true);
    };

    const pickReceipt = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "image/*",
                copyToCacheDirectory: true
            });

            console.log("Document picker result:", result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                console.log("Selected asset:", asset);
                setReceipt(asset);
            }
        } catch (error) {
            Toast.show({ type: "error", text1: "Upload Failed", text2: error.message });
        }
    };

    const handleSubmit = async () => {
        if (!referenceCode.trim() || !receipt) {
            Toast.show({
                type: "error",
                text1: "Missing Info",
                text2: "Please enter reference code and upload receipt.",
            });
            return;
        }

        console.log('CYMER');

        console.log("Selected plan:", selectedPlan);
        console.log("Reference code:", referenceCode);
        console.log("Receipt:", receipt);

        try {
            // Convert image to base64 like in ProfileScreen
            const base64Data = await FileSystem.readAsStringAsync(receipt.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Send as JSON data instead of FormData
            const { response, json } = await Api.post("store/subscription/payment", {
                subscription_id: selectedPlan.id,
                amount: selectedPlan.amount,
                reference_code: referenceCode.trim(),
                image_base64: base64Data,
                image_name: receipt.name || `receipt_${Date.now()}.png`,
                image_mime: receipt.mimeType || "image/png",
            });

            console.log('Response:', json);

            if (response.ok) {
                Toast.show({
                    type: "success",
                    text1: "Submitted",
                    text2: "Your payment will be verified.",
                });
                setModalVisible(false);
                setReferenceCode("");
                setReceipt(null);
            } else {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: json.message || "Something went wrong",
                });
            }
        } catch (error) {
            console.log("Full error:", error);
            Toast.show({
                type: "error",
                text1: "Upload Failed",
                text2: error.message,
            });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {plans.map((plan, index) => (
                <Card key={index} style={[styles.card, plan.highlight && styles.highlightCard, { borderLeftColor: plan.color }]}>
                    <Card.Title title={plan.name} subtitle={plan.price} titleStyle={[styles.title, { color: plan.color }]} />
                    <Card.Content>
                        {plan.features.map((feature, i) => (
                            <Text key={i} variant="bodyMedium" style={styles.feature}>
                                • {feature}
                            </Text>
                        ))}
                    </Card.Content>
                    <Card.Actions>
                        <Button
                            mode={plan.highlight ? "contained" : "outlined"}
                            buttonColor={plan.highlight ? plan.color : "transparent"}
                            textColor={plan.highlight ? "white" : plan.color}
                            style={styles.button}
                            onPress={() => handleChoosePlan(plan)}
                        >
                            Choose {plan.name}
                        </Button>
                    </Card.Actions>
                </Card>
            ))}

            {/* Payment Modal */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {selectedPlan && (
                            <>
                                <Text style={styles.modalText}>
                                    Please send <Text style={{ fontWeight: "bold" }}>₱{selectedPlan.amount}</Text> to this GCash number:
                                </Text>

                                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>09XXXXXXXXX</Text>

                                {/* Reference Code Input */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Reference Code"
                                    value={referenceCode}
                                    onChangeText={setReferenceCode}
                                />

                                {/* Receipt Upload */}
                                <Pressable style={styles.uploadButton} onPress={pickReceipt}>
                                    <Text style={styles.uploadText}>{receipt ? "Change Receipt" : "Upload Receipt"}</Text>
                                </Pressable>

                                {receipt && (
                                    <Image
                                        source={{ uri: receipt.uri }}
                                        style={{ width: 150, height: 150, marginTop: 10, borderRadius: 10 }}
                                    />
                                )}

                                {/* Actions */}
                                <View style={{ flexDirection: "row", marginTop: 20 }}>
                                    <Pressable style={[styles.buttonClose, { marginRight: 10 }]} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.textStyle}>Cancel</Text>
                                    </Pressable>
                                    <Pressable style={styles.buttonSubmit} onPress={handleSubmit}>
                                        <Text style={styles.textStyle}>Submit</Text>
                                    </Pressable>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    card: { marginBottom: 20, borderRadius: 16, borderLeftWidth: 6, elevation: 4 },
    highlightCard: { borderWidth: 2, borderColor: "#FFD700", elevation: 8 },
    title: { fontSize: 22, fontWeight: "bold" },
    feature: { marginBottom: 5 },
    button: { marginTop: 10, width: "100%", borderRadius: 12 },

    centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalView: { backgroundColor: "white", borderRadius: 20, padding: 25, alignItems: "center", width: "85%" },
    modalText: { marginBottom: 10, textAlign: "center", fontSize: 16 },

    input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 15 },
    uploadButton: { backgroundColor: "#eee", padding: 12, borderRadius: 10, width: "100%", alignItems: "center" },
    uploadText: { color: "#444" },

    buttonClose: { backgroundColor: "#888", padding: 12, borderRadius: 10 },
    buttonSubmit: { backgroundColor: "#28a745", padding: 12, borderRadius: 10 },
    textStyle: { color: "white", fontWeight: "bold" },
});