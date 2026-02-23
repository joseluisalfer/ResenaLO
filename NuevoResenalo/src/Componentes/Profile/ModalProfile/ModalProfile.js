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

                                <Button 
                                    onPress={toggleTheme} 
                                    mode="outlined" 
                                    style={styles.modalButton}
                                    textColor={theme.text}
                                   
                                >
                                    {isDark ? "Modo Claro" : "Modo Oscuro"}
                                </Button>
                                <Button
                                  onPress={() => setModalVisible(false)}
                                  mode="contained"
                                  style={styles.cancelButton}
                                  labelStyle={styles.cancelButtonText}
                                >
                                  Cancelar
                                </Button>
                            </>
                        ) : (
                            <>
                                {/* Opciones de idioma */}
                                <Button onPress={() => handleChangeLanguage("es")}>Español</Button>
                                <Button onPress={() => handleChangeLanguage("ca")}>Valenciano</Button>
                                <Button onPress={() => handleChangeLanguage("en")}>English</Button>
                                {/* Botón Salir con color rojo y texto blanco */}
                                <Button
                                  style={styles.exitButton}
                                  onPress={handleCancelLanguageChange}
                                  labelStyle={styles.exitButtonText}
                                >
                                  Salir
                                </Button>
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
        padding: 10,
        borderRadius: 30,
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
    cancelButton: {
        backgroundColor: "#DC3545",
        borderColor: "#DC3545",
        marginBottom: 10,
    },
    cancelButtonText: {
        color: "white",
    },
    exitButton: {
        backgroundColor: "#DC3545",
        borderColor: "#DC3545",
    },
    exitButtonText: {
        color: "white",
    },
});

export default ModalProfile;
