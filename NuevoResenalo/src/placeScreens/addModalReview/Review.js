import React, { useState, useContext } from "react";
import { 
    Pressable, 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    Alert, 
    ActivityIndicator, 
    Keyboard, 
    TouchableWithoutFeedback 
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { postData } from "../../services/Services";
import Context from "../../Context/Context";
import { useTranslation } from "react-i18next";
function Review({ route, navigation }) {
    const { reviewId } = route.params || {};
    
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    
    // Extraemos el theme del Contexto
    const { emailLogged, theme, isDark } = useContext(Context);
    const { t } = useTranslation();

    const handleSubmitReview = async () => {
        if (rating === 0) {
            Alert.alert("Error", "Por favor, selecciona una puntuación con las estrellas.");
            return;
        }
        if (!reviewText.trim()) {
            Alert.alert("Error", "El comentario no puede estar vacío.");
            return;
        }
        if (!reviewId) {
            Alert.alert("Error", "No se detectó el ID del lugar.");
            return;
        }

        setLoading(true);

        const data = {
            reviewId: reviewId,      
            user: emailLogged.results.user,
            text: reviewText.trim(),
            valoration: rating.toString()
        };

        try {
            const response = await postData(
                "http://44.213.235.160:8080/resenalo/commentReview",
                data
            );

            if (response === null || response) {
                Alert.alert("¡Hecho!", "Tu reseña se ha publicado correctamente.", [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert("Error", "El servidor no pudo procesar la reseña.");
            }
        } catch (error) {
            console.error("Error al enviar:", error);
            Alert.alert("Error", "Hubo un problema de conexión. Inténtalo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((i) => (
            <Pressable key={i} onPress={() => setRating(i)}>
                <Ionicons
                    name={i <= rating ? 'star' : 'star-outline'}
                    size={45}
                    color={i <= rating ? '#FFD700' : (isDark ? '#444' : '#BDC3C7')}
                    style={{ marginHorizontal: 5 }}
                />
            </Pressable>
        ));
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.layout, { backgroundColor: theme.background }]}>
                <View style={[
                    styles.card, 
                    { backgroundColor: isDark ? "#1e1e1e" : "#fff" }
                ]}>
                    <Text style={[styles.title, { color: theme.text }]}>{t("modalReview.header")}</Text>
                    
                    <View style={styles.starContainer}>
                        {renderStars()}
                    </View>

                    <TextInput
                        style={[
                            styles.input, 
                            { 
                                backgroundColor: isDark ? "#121212" : "#f9f9f9", 
                                borderColor: isDark ? "#333" : "#eee",
                                color: theme.text 
                            }
                        ]}
                        multiline
                        numberOfLines={5}
                        placeholder={t("modalReview.inputHolder")}
                        placeholderTextColor={isDark ? "#666" : "#999"}
                        value={reviewText}
                        onChangeText={setReviewText}
                    />
                    
                    <Pressable 
                        style={[
                            styles.submitButton, 
                            loading && (isDark ? styles.buttonDisabledDark : styles.buttonDisabled)
                        ]} 
                        onPress={handleSubmitReview}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>{t("modalReview.buttonAdd")}</Text>
                        )}
                    </Pressable>
                    
                    <Pressable 
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()} 
                        disabled={loading}
                    >
                        <Text style={[styles.cancelText, { color: isDark ? "#ff5c5c" : "#DC3545" }]}>
                            {t("modalReview.buttonCancel")}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 25,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        height: 120,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#2654d1',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#a5b4e0',
    },
    buttonDisabledDark: {
        backgroundColor: '#1a3582',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 14,
        fontWeight: '500',
    }
});

export default Review;