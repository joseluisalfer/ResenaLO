import React, { useState } from "react";
import { View, StyleSheet, TextInput, Button, Text, ScrollView, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';

const EditUser = () => {
    const [name, setName] = useState("Samuel Rodriguez");
    const [username, setUsername] = useState("@samueltrava.official");
    const [location, setLocation] = useState("Valencia, España");
    const [bio, setBio] = useState("Desarrollador móvil | Amante de las mujeres | LOL player");

    const navigation = useNavigation();

    // Funciones de manejo sin la lógica de API
    const handleSave = () => {
        console.log("Guardar cambios - aún no implementado.");
        navigation.goBack(); // Redirige a la pantalla anterior
    };

    const handleCancel = () => {
        navigation.goBack(); // Redirige a la pantalla anterior sin guardar cambios
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.inputContainer}>
                {/* Campos de edición */}
                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nombre de usuario"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ubicación"
                    value={location}
                    onChangeText={setLocation}
                />
                <TextInput
                    style={styles.bioInput}
                    placeholder="Biografía"
                    value={bio}
                    onChangeText={setBio}
                    multiline={true}
                    numberOfLines={4}
                />
            </View>

            {/* Botones de acción */}
            <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                <Pressable style={styles.addReviewButton} onPress={{/*Meter lógica*/ }}>
                    <Text style={styles.addReviewButtonText}>Guardar Cambios</Text>
                </Pressable>

                <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        padding: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 15,
        fontSize: 16,
    },
    buttonsContainer: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    addReviewButton: {
        backgroundColor: '#1748ce',
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        width: '80%',
        alignItems: 'center',
    },
    addReviewButtonText: {
        color: 'white',
        fontSize: 18,
    },
    cancelButton: {
        backgroundColor: '#DC3545',
        padding: 8,
        borderRadius: 8,
        marginTop: 10,
        width: '60%',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
    bioInput: {
        height: 150,  // Mayor altura para dar espacio
        backgroundColor: "#fff",
        borderRadius: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 20,
        padding: 15,  // Espaciado dentro del campo
        fontSize: 16,
        textAlignVertical: "top",  // Alinea el texto en la parte superior
    },
});

export default EditUser;
