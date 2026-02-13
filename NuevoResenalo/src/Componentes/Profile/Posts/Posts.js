import React from "react";
import { View, Text, StyleSheet, FlatList, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icono para navegación
import { Card } from "react-native-paper";

const Posts = ({ navigation }) => {
    const [places, setPlaces] = React.useState([
        {
            id: "1",
            name: "Catarroja Plaza",
            image: require("../../../../assets/images/CatarrojaPlaza.jpg"),
            rating: "4.5/5",
            description: "Un lugar tranquilo para disfrutar.",
        },
        {
            id: "2",
            name: "Catarroja Parque",
            image: require("../../../../assets/images/CatarrojaPlaza.jpg"),
            rating: "4.0/5",
            description: "Ideal para pasear y relajarse.",
        },
        {
            id: "3",
            name: "Catarroja Fuente",
            image: require("../../../../assets/images/CatarrojaPlaza.jpg"),
            rating: "3.8/5",
            description: "Un lugar bonito para hacer fotos.",
        },
        {
            id: "4",
            name: "Catarroja Playa",
            image: require("../../../../assets/images/CatarrojaPlaza.jpg"),
            rating: "4.7/5",
            description: "Un lugar ideal para un día de sol.",
        },
        {
            id: "5",
            name: "Catarroja Estadio",
            image: require("../../../../assets/images/CatarrojaPlaza.jpg"),
            rating: "4.2/5",
            description: "Para los amantes del deporte.",
        },
    ]);

    return (
        <View style={styles.wrapper}>
            {/* Título y botón de navegación */}
            <Pressable
                style={styles.header}
                onPress={() => navigation.navigate("Place")}
            >
                <Text style={styles.title}>Publicaciones</Text>
                <Ionicons name="chevron-forward-outline" size={25} color="#000" />
            </Pressable>

            {/* Grid de publicaciones con 2 columnas */}
            <FlatList
                data={places}
                keyExtractor={(item) => item.id}
                numColumns={2} // Mostrar en 2 columnas
                renderItem={({ item }) => (
                    <Pressable
                        key={item.id}
                        style={styles.card}
                        onPress={() => navigation.navigate("Place", { placeId: item.id })}
                    >
                        <Card style={styles.cardContainer}>
                            {/* Imagen dentro del Card */}
                            <Card.Cover source={item.image} style={styles.image} resizeMode="cover" />

                            {/* Contenido del Card */}
                            <Card.Content style={styles.cardContent}>
                                <Text style={styles.placeName}>{item.name}</Text>
                                <Text style={styles.rating}>Calificación: {item.rating}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </Card.Content>
                        </Card>
                    </Pressable>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
    },
    cardContainer: {
        width: "90%", // Esto asegura que cada tarjeta ocupe el 48% del ancho de la pantalla
        marginBottom: 10, // Espacio entre tarjetas
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#2654d1", // Fondo de la tarjeta con el color especificado
        height: 250, // Ajustamos la altura de la tarjeta para que no se vea demasiado grande
    },
    image: {
        height: 100,
        width: "100%",
        borderRadius: 10,
    },
    cardContent: {
        padding: 8,
    },
    placeName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff", // Texto blanco para mayor contraste con el fondo oscuro
    },
    rating: {
        fontSize: 14,
        color: "#fff", // Texto blanco para mayor contraste
    },
    description: {
        fontSize: 12,
        color: "#fff", // Texto blanco para mayor contraste
    },
});

export default Posts;
