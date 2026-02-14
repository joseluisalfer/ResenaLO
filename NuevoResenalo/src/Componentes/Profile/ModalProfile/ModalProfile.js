import React, { useState } from "react";
import { View, StyleSheet, Modal, Pressable, Text } from "react-native";
import { Button } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';

const ModalProfile = ({ handleLogOut, handleChangeLanguage }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [showLanguageOptions, setShowLanguageOptions] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("Español");

    const handleCancelLanguageChange = () => {
        setShowLanguageOptions(false);
    };

    const handleChangeToLanguageSelection = () => {
        setShowLanguageOptions(true);
    };

    return (
        <View style={styles.container}>
            {/* Icono de configuración */}
            <Pressable onPress={() => setModalVisible(true)} style={styles.iconContainer}>
                <Ionicons name="settings-outline" size={30} color="black" />
            </Pressable>

            {/* Modal de opciones */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {!showLanguageOptions ? (
                            <>
                                {/* Opciones generales */}
                                <Button onPress={handleLogOut} mode="outlined" style={styles.modalButton}>
                                    Log Out
                                </Button>
                                <Button onPress={handleChangeToLanguageSelection} mode="outlined" style={styles.modalButton}>
                                    Cambiar Idioma
                                </Button>
                                <Button mode="outlined" style={styles.modalButton}>
                                    Cambiar Tema
                                </Button>
                                <Button onPress={() => setModalVisible(false)} mode="outlined" style={styles.modalButton}>
                                    Cancelar
                                </Button>
                            </>
                        ) : (
                            <>
                                {/* Opciones de idioma */}
                                <Button onPress={() => handleChangeLanguage("es")}>Español</Button>
                                <Button onPress={() => handleChangeLanguage("ca")}>Valenciano</Button>
                                <Button onPress={() => handleChangeLanguage("en")}>English</Button>
                                <Button onPress={handleCancelLanguageChange}>Salir</Button>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1,
    },
    iconContainer: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        width: "80%",
    },
    modalButton: {
        marginBottom: 10,
    },
});

export default ModalProfile;
