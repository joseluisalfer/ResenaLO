import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";



const CardInfo = () => {

    return (
        <View>
            <Card style={styles.statsCard}>
                <Card.Content style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text variant="titleMedium">24</Text>
                        <Text variant="bodySmall">Posts</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text variant="titleMedium">100</Text>
                        <Text variant="bodySmall">Comentarios</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text variant="titleMedium">30</Text>
                        <Text variant="bodySmall">Amigos</Text>
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    statsCard: {
        marginTop: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        marginHorizontal: 16,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 12,
    },
    statItem: {
        alignItems: "center",
    },
})

export default CardInfo;