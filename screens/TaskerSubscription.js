import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Card, Text } from "react-native-paper";

const purchaseBtn = (plan) => alert(`Subscribed to ${plan}!`);

export default function SubscriptionScreen() {
    const plans = [
        // {
        //     name: "Free",
        //     price: "₱0 / month",
        //     color: "#4CAF50", // green
        //     features: ["Basic Access", "Limited Features", "Community Support"],
        // },
        {
            name: "Standard",
            price: " 59 / month",
            color: "#198754", // blue
            features: ["Full Access of a Courier Feature", "Standard Features", "Chat Client"],
        },
        // {
        //     name: "Premium",
        //     price: "₱399 / month",
        //     color: "#FFD700", // gold
        //     highlight: true,
        //     features: ["Unlimited Access", "All Features", "Priority Support"],
        // },
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {plans.map((plan, index) => (
                <Card
                    key={index}
                    style={[
                        styles.card,
                        plan.highlight && styles.highlightCard,
                        { borderLeftColor: plan.color },
                    ]}
                >
                    <Card.Title
                        title={plan.name}
                        subtitle={plan.price}
                        titleStyle={[styles.title, { color: plan.color }]}
                        subtitleStyle={styles.subtitle}
                    />
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
                            onPress={() => purchaseBtn(plan.name)}
                        >
                            Purchase {plan.name}
                        </Button>
                    </Card.Actions>
                </Card>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    card: {
        marginBottom: 20,
        borderRadius: 16,
        borderLeftWidth: 6,
        elevation: 4,
    },
    highlightCard: {
        borderWidth: 2,
        borderColor: "#FFD700",
        elevation: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    feature: {
        marginBottom: 6,
        fontSize: 15,
    },
    button: {
        marginTop: 10,
        width: "100%",
        borderRadius: 12,
    },
});
