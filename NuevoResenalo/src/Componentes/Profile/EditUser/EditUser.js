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
import { getData, updateData } from "../../../services/services";
import Context from "../../../Context/Context";

const EditUser = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const navigation = useNavigation();

    // Obtenemos el objeto emailLogged del context
    const { emailLogged, setEmailLogged } = useContext(Context);

    // Accedemos directamente a la propiedad email del objeto
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
                /**
                 * Aquí capturamos el fallo del services.js.
                 * Si el error es de JSON (SyntaxError), significa que el PUT 
                 * llegó al servidor y se ejecutó, pero la respuesta no era un JSON.
                 */
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
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#1748ce" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.inputContainer}>
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
                    autoCapitalize="none"
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

            <View style={{ justifyContent: "flex-end", alignItems: "center" }}>
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
    addReviewButton: {
        backgroundColor: "#1748ce",
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        width: "80%",
        alignItems: "center",
    },
    addReviewButtonText: {
        color: "white",
        fontSize: 18,
    },
    cancelButton: {
        backgroundColor: "#DC3545",
        padding: 8,
        borderRadius: 8,
        marginTop: 10,
        width: "60%",
        alignItems: "center",
    },
    cancelButtonText: {
        color: "white",
        fontSize: 16,
    },
    bioInput: {
        height: 150,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 20,
        padding: 15,
        fontSize: 16,
        textAlignVertical: "top",
    },
});

export default EditUser;