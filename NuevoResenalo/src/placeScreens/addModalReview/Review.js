import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, TextInput } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

function Review(props) {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);

    const handleReviewChange = (text) => setReview(text);

    const handleRatingChange = (newRating) => setRating(newRating);

    const handleSubmitReview = () => {
        console.log(`Reseña: ${review}, Calificación: ${rating}`);
    };
    
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Pressable key={i} onPress={() => handleRatingChange(i)}>
                    <Ionicons
                        name={i <= rating ? 'star' : 'star-outline'}
                        size={40}
                        color={i <= rating ? 'gold' : 'gray'}
                    />
                </Pressable>
            );
        }
        return stars;
    };

    return (
        <View style={styles.layout}>
            <Text style={styles.title}>Añadir Reseña</Text>
            
            <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                placeholder="Escribe tu reseña aquí"
                value={review}
                onChangeText={handleReviewChange}
            />
            
            <View style={styles.starContainer}>
                {renderStars()}
            </View>
            
            <Pressable style={styles.addReviewButton} onPress={handleSubmitReview}>
                <Text style={styles.addReviewButtonText}>Añadir Reseña</Text>
            </Pressable>
            
            <Pressable style={styles.cancelButton} onPress={() => props.navigation.goBack()}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: { 
        fontSize: 32, 
        marginBottom: 16,
        fontWeight: 'bold'
    },
    input: {
        width: '100%',
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 20,
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
    }
});

export default Review;
