import React, { useState, useContext } from "react";
import { View, StyleSheet, Modal, Pressable, Text } from "react-native";
import { Button } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import Context from "../../../Context/Context";

const ModalProfile = ({ handleLogOut, handleChangeLanguage }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [showLanguageOptions, setShowLanguageOptions] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("Español");

    // 1. Extraemos theme además de isDark y toggleTheme
    const { isDark, toggleTheme, theme } = useContext(Context);

    const handleCancelLanguageChange = () => {
        setShowLanguageOptions(false);
    };

    const handleChangeToLanguageSelection = () => {
        setShowLanguageOptions(true);
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => setModalVisible(true)} style={styles.iconContainer}>
                {/* 2. El color del icono ahora depende del tema */}
                <Ionicons name="settings-outline" size={30} color={theme.text} />
            </Pressable>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    {/* 3. Fondo dinámico para el cuadro del modal */}
                    <View style={[styles.modalContent, { backgroundColor: isDark ? "#1E1E1E" : "white" }]}>
                        {!showLanguageOptions ? (
                            <>
                                {/* 4. Añadimos textColor a los botones para que se vean en fondo oscuro */}
                                <Button 
                                    onPress={handleLogOut} 
                                    mode="outlined" 
                                    style={styles.modalButton}
                                    textColor={theme.text}
                                >
                                    Log Out
                                </Button>
                                <Button 
                                    onPress={handleChangeToLanguageSelection} 
                                    mode="outlined" 
                                    style={styles.modalButton}
                                    textColor={theme.text}
                                >
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
                                <Button onPress={() => handleChangeLanguage("es")} textColor={theme.text}>Español</Button>
                                <Button onPress={() => handleChangeLanguage("ca")} textColor={theme.text}>Valenciano</Button>
                                <Button onPress={() => handleChangeLanguage("en")} textColor={theme.text}>English</Button>
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
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Un poco más oscuro el fondo exterior
    },
    modalContent: {
        borderRadius: 15, // Un poco más redondeado para look moderno
        padding: 20,
        width: "80%",
        elevation: 5, // Sombra para Android
        shadowColor: "#000", // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalButton: {
        marginBottom: 10,
        borderColor: "#555", // Borde grisáceo para que se vea en ambos temas
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