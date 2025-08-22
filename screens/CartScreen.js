import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

export default function CartScreen({ navigation }) {
    // sample cart items (replace with real data later)
    const [cartItems, setCartItems] = useState([
        { id: '1', name: 'PAP SCHOOL', price: 199, image: 'https://picsum.photos/200', checked: false },
        { id: '2', name: 'CTU NAGA SCHOOL', price: 299, image: 'https://picsum.photos/200', checked: false },
        { id: '3', name: 'CTU NAGA SCHOOL', price: 99, image: 'https://picsum.photos/200', checked: false },
    ]);

    // compute total only for checked items
    const total = cartItems
        .filter(item => item.checked)
        .reduce((sum, item) => sum + item.price, 0);

    const handleCheck = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const handleBuy = () => {
        const selected = cartItems.filter(item => item.checked);
        if (selected.length === 0) {
            alert('Please select at least one item ✅');
            return;
        }
        alert(`Proceeding to checkout 🚀\nItems: ${selected.map(i => i.name).join(', ')}`);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <CheckBox
                value={item.checked}
                onValueChange={() => handleCheck(item.id)}
            />
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>₱{item.price}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>🛒 Your Cart</Text>

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.empty}>Your cart is empty</Text>}
            />

            <View style={styles.footer}>
                <Text style={styles.total}>Total: ₱{total}</Text>
                <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
                    <Text style={styles.buyText}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    image: {
        marginLeft: 10,
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: '#eee',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '500',
        color: '#444',
        marginTop: 4,
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#777',
    },
    footer: {
        marginTop: 'auto',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    buyButton: {
        backgroundColor: '#ff6f61',
        paddingVertical: 14,
        paddingHorizontal: 50,
        borderRadius: 30,
    },
    buyText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
