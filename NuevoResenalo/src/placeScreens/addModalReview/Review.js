import React, { useState } from 'react';
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
import { postData } from "../../services/services";

function Review({ route, navigation }) {
    const { reviewId } = route.params || {};
    
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);

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
            user: "Unai", 
            text: reviewText.trim(),
            valoration: rating.toString()
        };

        try {
            console.log("Enviando reseña:", data);
            
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
                    color={i <= rating ? '#FFD700' : '#BDC3C7'}
                    style={{ marginHorizontal: 5 }}
                />
            </Pressable>
        ));
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.layout}>
                <View style={styles.card}>
                    <Text style={styles.title}>¿Qué te pareció?</Text>
                    
                    <View style={styles.starContainer}>
                        {renderStars()}
                    </View>

                    <TextInput
                        style={styles.input}
                        multiline
                        numberOfLines={5}
                        placeholder="Escribe aquí tu opinión sobre este lugar..."
                        placeholderTextColor="#999"
                        value={reviewText}
                        onChangeText={setReviewText}
                    />
                    
                    <Pressable 
                        style={[styles.submitButton, loading && styles.buttonDisabled]} 
                        onPress={handleSubmitReview}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Publicar Reseña</Text>
                        )}
                    </Pressable>
                    
                    <Pressable 
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()} 
                        disabled={loading}
                    >
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </Pressable>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
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
        color: '#333'
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 25,
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderColor: '#eee',
        borderWidth: 1,
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        height: 120,
        textAlignVertical: 'top',
        marginBottom: 20,
        color: '#333'
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
        color: '#DC3545',
        fontSize: 14,
        fontWeight: '500',
    }
});

export default Review;