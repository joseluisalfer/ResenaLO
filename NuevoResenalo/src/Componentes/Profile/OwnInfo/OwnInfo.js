import React, { useState, useContext } from "react"; // 1. Añadimos useContext
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import ProfileImage from "../ProfileImage/ProfileImage";
import Context from "../../../Context/Context"; // 2. Importamos tu Context

const OwnInfo = ({ user, description, name}) => {
    const navigation = useNavigation();

    // 3. Extraemos theme e isDark del contexto
    const { theme, isDark } = useContext(Context);

    return (
        <View style={styles.container}>
            {/* Imagen de perfil */}
            <ProfileImage/>

            <View style={{ alignItems: "center" }}>
                {/* El nombre de usuario suele quedar bien en gris, pero puedes usar theme.text si prefieres */}
                <Text style={[styles.username, { color: isDark ? "#AAA" : "gray" }]}>
                    @{user}
                </Text>
            </View>

            <View style={{ alignItems: "center" }}>
                {/* 4. Aplicamos color dinámico al Nombre */}
                <Text style={[styles.name, { color: theme.text }]}>
                    {name}
                </Text>
                
                {/* 5. Aplicamos color dinámico a la Bio */}
                <Text style={[styles.bio, { color: theme.text }]}>
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
        // Eliminamos el backgroundColor fijo para que herede del padre o se maneje globalmente
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