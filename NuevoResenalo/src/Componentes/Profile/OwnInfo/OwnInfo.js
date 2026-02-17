import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import ProfileImage from "../ProfileImage/ProfileImage";

const OwnInfo = ({ image, user, description}) => {  // Recibe 'image' directamente
    const navigation = useNavigation();

    return (
        <View>
            {/* Imagen de perfil */}
            <ProfileImage image={image}  />

            <View style={{ alignItems: "center" }}>
                <Text variant="bodyMedium" style={styles.username}>
                    @samueltrava.official
                </Text>
            </View>

            <View style={{ alignItems: "center" }}>
                <Text variant="headlineSmall" style={styles.name}>
                    {user}
                </Text>
                
                <Text variant="bodyMedium" style={styles.bio}>
                    {description}
                </Text>
            </View>

            {/* Botón de editar perfil */}
            <Button
                mode="contained"
                onPress={() => navigation.navigate("EditProfile")}
                style={styles.editButton}
            >
                Editar Perfil
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        marginTop: 40,
    },
    editButton: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        width: 200,
        alignSelf: "center",
        backgroundColor: '#1748ce'
    },
    username: {
        color: "gray",
        marginTop: 3,
    },
    name: {
        marginTop: 5,
        fontSize: 25,
        fontWeight: "bold",
    },
    ubication: {
        color: "gray",
        marginTop: 0,
    },
    bio: {
        textAlign: "center",
        marginTop: 8,
        paddingHorizontal: 20,
    },
})

export default OwnInfo;
