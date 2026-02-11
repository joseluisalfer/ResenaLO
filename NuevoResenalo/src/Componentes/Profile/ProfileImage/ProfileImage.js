import React from "react";
import { View, Pressable, Text, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

const ProfileImage = ({ image, setImage }) => {
    const seleccionarImagen = async () => {
        Alert.alert("Cambiar imagen de perfil", "Elige una opción", [
            {
                text: "Galería",
                onPress: async () => {
                    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (!permissionResult.granted) {
                        Alert.alert("Necesitamos permisos para acceder a la galería");
                        return;
                    }

                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        quality: 0.7,
                    });

                    if (!result.canceled) {
                        setImage(result.assets[0].uri); // Cambiar la imagen
                    }
                },
            },
            {
                text: "Cámara",
                onPress: async () => {
                    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
                    if (!permissionResult.granted) {
                        Alert.alert("Necesitamos permisos para usar la cámara");
                        return;
                    }

                    const result = await ImagePicker.launchCameraAsync({
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                    });

                    if (!result.canceled) {
                        setImage(result.assets[0].uri); // Cambiar la imagen
                    }
                },
            },
            {
                text: "Eliminar foto de perfil",
                onPress: async () => {
                    setImage(null);
                },
            },
            { text: "Cancelar", style: "cancel" },
        ]);
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={seleccionarImagen} style={styles.photoSquare}>
                {/* Si hay imagen, la mostramos dentro del círculo */}
                {image ? (
                    <Image source={{ uri: image }} style={styles.photo} />
                ) : (
                    // Si no hay imagen, mostramos el '+' grande dentro del círculo
                    <Text style={styles.plus}>+</Text>
                )}

                {/* Mostrar el círculo con el '+' solo cuando haya imagen */}
                {image && (
                    <View style={styles.addButtonContainer}>
                        <Text style={styles.addButton}>+</Text>
                    </View>
                )}
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 35,
        alignItems: "center",
    },
    photoSquare: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        position: "relative",
    },
    photo: {
        width: "100%",
        height: "100%",
        borderRadius: 60,
    },
    plus: {
        fontSize: 40,
        color: "#aaa",
        fontWeight: "bold",
    },
    addButtonContainer: {
        position: "absolute",
        bottom: 5,
        right: 5,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    addButton: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        lineHeight: 18,
    },
});

export default ProfileImage;
