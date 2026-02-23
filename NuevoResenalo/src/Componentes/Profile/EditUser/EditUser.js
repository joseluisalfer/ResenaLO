import React, { useState, useEffect, useContext } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getData, updateData } from "../../../services/Services";
import Context from "../../../Context/Context";

const EditUser = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const navigation = useNavigation();

    const { emailLogged, setEmailLogged, theme, isDark } = useContext(Context);

    const userEmail = emailLogged?.results?.email;

    const loadUser = async () => {
        try {
            setLoading(true);
            if (!userEmail) {
                setLoading(false);
                return;
            }
            const res = await getData(
                `http://44.213.235.160:8080/resenalo/userEmail?email=${userEmail}`
            );

            if (res && res.results) {
                setName(res.results.name || "");
                setUsername(res.results.user || "");
                setBio(res.results.description || "");
            }
        } catch (e) {
            console.error("Error cargando usuario:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const handleSave = async () => {
        try {
            if (saving) return;
            if (!userEmail) {
                Alert.alert("Error", "No se encontró el email de sesión.");
                return;
            }

            const cleanName = name.trim();
            const cleanUsername = username.trim().replace(/^@/, "");
            const cleanBio = bio.trim();

            if (cleanName === "" || cleanUsername === "") {
                Alert.alert("Error", "Nombre y username no pueden estar vacíos.");
                return;
            }

            setSaving(true);
            const updatedUserData = {
                email: userEmail,
                newName: cleanName,
                newUsername: cleanUsername,
                newDescription: cleanBio
            };

            try {
                await updateData(
                    "http://44.213.235.160:8080/resenalo/updateUser",
                    updatedUserData
                );
            } catch (innerError) {
                if (innerError.message.includes("JSON") || innerError.message.includes("Unexpected end")) {
                    console.log("Aviso: El servidor actualizó pero no envió un JSON. Todo OK.");
                } else {
                    throw innerError;
                }
            }
            setEmailLogged({
                ...emailLogged,
                results: {
                    ...emailLogged.results,
                    name: cleanName,
                    user: cleanUsername,
                    description: cleanBio
                }
            })
            Alert.alert("Éxito", "Perfil actualizado correctamente.");
            navigation.goBack();

        } catch (e) {
            console.error("Error real al actualizar:", e);
            Alert.alert("Error", "No se pudieron guardar los cambios.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary || "#1748ce"} />
            </View>
        );
    }

    return (
        /* Aplicamos el fondo a la vista que envuelve todo */
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <ScrollView 
                style={styles.container}
                contentContainerStyle={{ flexGrow: 1, backgroundColor: theme.background }}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[
                            styles.input, 
                            { 
                                backgroundColor: isDark ? "#121212" : "#fff", 
                                color: theme.text, 
                                borderColor: isDark ? "#333" : "#ccc" 
                            }
                        ]}
                        placeholder="Nombre"
                        placeholderTextColor={isDark ? "#666" : "#999"}
                        value={name}
                        onChangeText={setName}
                    />

                    <TextInput
                        style={[
                            styles.input, 
                            { 
                                backgroundColor: isDark ? "#121212" : "#fff", 
                                color: theme.text, 
                                borderColor: isDark ? "#333" : "#ccc" 
                            }
                        ]}
                        placeholder="Nombre de usuario"
                        placeholderTextColor={isDark ? "#666" : "#999"}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={[
                            styles.bioInput, 
                            { 
                                backgroundColor: isDark ? "#121212" : "#fff", 
                                color: theme.text, 
                                borderColor: isDark ? "#333" : "#ccc" 
                            }
                        ]}
                        placeholder="Biografía"
                        placeholderTextColor={isDark ? "#666" : "#999"}
                        value={bio}
                        onChangeText={setBio}
                        multiline={true}
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Pressable
                        style={[styles.addReviewButton, saving ? { opacity: 0.7 } : null]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.addReviewButtonText}>Guardar Cambios</Text>
                        )}
                    </Pressable>

                    <Pressable
                        style={[styles.cancelButton, saving ? { opacity: 0.7 } : null]}
                        onPress={() => navigation.goBack()}
                        disabled={saving}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        marginBottom: 20,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: "flex-end", 
        alignItems: "center",
        paddingBottom: 20,
    },
    input: {
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 15,
        fontSize: 16,
    },
    bioInput: {
        height: 150,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 20,
        padding: 15,
        fontSize: 16,
        textAlignVertical: "top",
    },
    addReviewButton: {
        backgroundColor: "#1748ce",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        width: "90%",
        alignItems: "center",
    },
    addReviewButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    cancelButton: {
        backgroundColor: "#DC3545",
        padding: 10,
        borderRadius: 10,
        marginTop: 15,
        width: "60%",
        alignItems: "center",
    },
    cancelButtonText: {
        color: "white",
        fontSize: 16,
    },
});

export default EditUser;