import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TabsScreen from './tabs';
import SubscriptionScreen from './screens/Subscription';
import TaskerSubscriptionScreen from './screens/TaskerSubscription.js';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({ setIsAuthenticated }) {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerTitle: 'Campus Grab',
                headerRight: () => (
                    <TouchableOpacity onPress={() => alert('Notifications')} style={{ marginRight: 15 }}>
                        <Ionicons name="notifications-outline" size={24} />
                    </TouchableOpacity>
                ),
            }}
        >
            <Drawer.Screen name="Home" options={{ headerShown: true }}>
                {(props) => <TabsScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Drawer.Screen>
            <Drawer.Screen name="Subscription" component={SubscriptionScreen} />
            <Drawer.Screen name="Be a Campus Courier" component={TaskerSubscriptionScreen} />
        </Drawer.Navigator>
    );
}
