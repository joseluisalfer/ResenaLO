import React from "react";
import { View, FlatList, StyleSheet, Text, Pressable, Image } from "react-native";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next'
import '../../../../assets/i18n/index';
import { useState } from "react";
{/*const mockPosts = [
  {
    id: "1",
    title: "En Catarroja hay moros",
    content: "No lo digo yo, lo dice la gente, ¡vaya locura! 😂",
  },
  {
    id: "2",
    title: "Que no lo vea mi madre!",
    content: "Que no vea mi madre ese mueble de la basura que se lo lleva para casa!!! 😲"
  },
  {
    id: "3",
    title: "Un secretillo",
    content: "Y un secretillo... he comido jamón. 🤫"
  },
  {
    id: "4",
    title: "Sabeis que??",
    content: "He robado en el dia"
  }
];*/}

const PostList = () => {
  const { t } = useTranslation();
  const [places, setPlaces] = useState([
     {
       id: "1",
       name: "Catarroja Plaza",
       image: require("../../../../assets/images/CatarrojaPlaza.jpg"),
       rating: "4.5/5",
     },
     {
       id: "2",
       name: "Catarroja Parque",
       image: require("../../../../assets/images/CatarrojaParque.jpg"),
       rating: "4.0/5",
     },
     {
       id: "3",
       name: "Catarroja Fuente",
       image: require("../../../../assets/images/CatarrojaPlaza.jpg"),
       rating: "3.8/5",
     },
     {
       id: "4",
       name: "Catarroja Playa",
       image: require("../../../../assets/images/CatarrojaParque.jpg"),
       rating: "4.7/5",
     },
     {
       id: "5",
       name: "Catarroja Estadio",
       image: require("../../../../assets/images/CatarrojaPlaza.jpg"),
       rating: "4.2/5",
     }, {
       id: "6",
       name: "Catarroja Estadio",
       image: require("../../../../assets/images/CatarrojaParque.jpg"),
       rating: "4.2/5",
     }
   ]);
 
   return (
     <View style={styles.wrapper}>
       {/* Título y botón de navegación */}
       <Pressable
         style={styles.header}
         onPress={() => navigation.navigate("Place")}
       >
         <Text style={styles.title}>Publicaciones</Text>
         <Ionicons name="chevron-forward-outline" size={25} color="#000" style={{marginTop: 20}} />
       </Pressable>
 
       {/* Grid de publicaciones con 2 columnas */}
       <FlatList
         data={places}
         keyExtractor={(item) => item.id}
         numColumns={2} // Mostrar en 2 columnas
         renderItem={({ item, index }) => {
 
           const backgroundColor = index % 3 === 0 ? "#1748ce" : index % 3 === 1 ? "#DC3545" : 'white';
           const textColor = backgroundColor === 'white' ? 'black' : 'white';
 
           
           return (
             <Pressable
               key={item.id}
               style={styles.card}
               onPress={() => navigation.navigate("Place", { placeId: item.id })}
             >
               <Card style={[styles.cardContainer, { backgroundColor }]}>
                 {/* Imagen dentro del Card */}
                 <Card.Cover source={item.image} style={styles.image} resizeMode="cover" />
 
                 {/* Contenido del Card */}
                 <Card.Content style={styles.cardContent}>
                   <Text style={[styles.placeName, { color: textColor }]}>{item.name}</Text>
                   <Text style={[styles.rating, { color: textColor }]}>Calificación: {item.rating}</Text>
                 </Card.Content>
               </Card>
             </Pressable>
           );
         }}
       />
     </View>
   );
 };
 
 const styles = StyleSheet.create({
   wrapper: {
     flex: 1,
     paddingHorizontal: 8,
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
     marginTop: 20
   },
   cardContainer: {
     flex: 1, // Asegura que cada tarjeta ocupe el mismo espacio en su columna
     margin: 8,
     borderRadius: 12,
     overflow: "hidden",
     backgroundColor: "#1748ce", // Fondo de la tarjeta
     height: "100%"
   },
   image: {
     height: 100, // Imagen con una altura consistente
     width: "100%",
     borderRadius: 10,
     aspectRatio: 1.5,
   },
   cardContent: {
     padding: 8,
     justifyContent: "space-between",
 
   },
   placeName: {
     fontSize: 14, // Tamaño de fuente más pequeño
     fontWeight: "bold",
     color: "#fff", // Texto blanco para mayor contraste
   },
   rating: {
     fontSize: 12, // Tamaño de fuente más pequeño
     color: "#fff", // Texto blanco para mayor contraste
   },
 });
export default PostList;
