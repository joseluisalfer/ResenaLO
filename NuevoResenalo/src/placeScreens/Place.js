import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons"; // Importando Ionicons
import CommentBox from "../Componentes/Place/CommentBox"; // Importar el componente

const Place = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 39.4038783, // Coordenadas de Catarroja
    longitude: -0.4034584,
    latitudeDelta: 0.0922, // Ajusta el zoom
    longitudeDelta: 0.0421, // Ajusta el zoom
  });

  const [images, setImages] = useState([
    require("../../assets/images/CatarrojaPlaza.jpg"),
    require("../../assets/images/CatarrojaParque.jpg"),
    require("../../assets/images/CatarrojaFuente.jpg"),
  ]);
  const [imagePos, setImagePos] = useState(0);

  const nextImage = () => {
    if (imagePos === images.length - 1) {
      setImagePos(0);
    } else {
      setImagePos(imagePos + 1);
    }
  };

  const prevImage = () => {
    if (imagePos === 0) {
      setImagePos(images.length - 1);
    } else {
      setImagePos(imagePos - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={30}
            color="black"
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          />
        <Ionicons
            name="settings-outline"
            size={30}
            color="black"
            style={styles.backButton}
            //Poner opciones que si es el dueño de la reseña pueda eliminar o editar
            onPress={() => navigation.goBack()}
          />
      </View>
      <ScrollView>
        <View style={styles.imageContainer}>
          {/* Flecha izquierda */}
          <TouchableOpacity style={styles.arrowLeft} onPress={prevImage}>
            <Ionicons name="chevron-back-outline" size={30} color="#fff" />
            {/* Flecha hacia atrás */}
          </TouchableOpacity>

          <Image
            source={images[imagePos]} // Ruta de la imagen local
            style={styles.image}
            resizeMode="cover" // Ajusta la imagen para cubrir el área
          />

          {/* Flecha derecha */}
          <TouchableOpacity style={styles.arrowRight} onPress={nextImage}>
            <Ionicons name="chevron-forward-outline" size={30} color="#fff" />
            {/* Flecha hacia adelante */}
          </TouchableOpacity>
        </View>
        <View style={styles.details}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>Catarroja</Text>

            {/* Estrellas alineadas a la derecha */}
            <View style={styles.starsContainer}>
              <Text style={{ fontSize: 30 }}>5</Text>
              <Ionicons name="star" size={30} color="#000000" />
            </View>
          </View>

          <Text style={styles.description}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </Text>

          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={region} // Cambiar a 'region' para controlar el mapa dinámicamente
              onRegionChangeComplete={(newRegion) => setRegion(newRegion)} // Actualizar región si cambia
              scrollEnabled={false} // Deshabilitar el desplazamiento
              zoomEnabled={false} // Deshabilitar el zoom
              rotateEnabled={false} // Deshabilitar la rotación
              pitchEnabled={false} // Deshabilitar la inclinación
            >
              <Marker
                coordinate={{ latitude: 39.4038783, longitude: -0.4034584 }}
                title={"Catarroja"}
              />
            </MapView>
          </View>
          <View style={{ alignItems: "center", marginTop: "3%" }}>
            <Pressable style={styles.addBox}>
              <Text style={{ fontSize: 20 }}>Añadir reseña</Text>
              <Ionicons name="add" size={50} color="#000000" />
            </Pressable>
          </View>
          <CommentBox
            name="Juan Pérez"
            comment="Este es un comentario de ejemplo. ¡Me encanta esta aplicación!"
            stars="4.4"
          />
          <CommentBox
            name="María López"
            comment="¡Genial! Muy útil para organizar tareas."
            stars="5"
          />
          <CommentBox
            name="Carlos Sánchez"
            comment="Me gustaría que tuvieran más opciones para personalizar."
            stars="3.4"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: "5%",
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    marginVertical: 20,
    position: "relative", // Necesario para posicionar las flechas sobre la imagen
  },
  image: {
    width: "100%",
    height: "100%",
  },
  arrowLeft: {
    position: "absolute",
    top: "50%",
    left: 10,
    transform: [{ translateY: -15 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente para las flechas
    padding: 10,
    borderRadius: 20,
    zIndex: 1, // Asegurarnos de que la flecha esté encima de la imagen
  },
  arrowRight: {
    position: "absolute",
    top: "50%",
    right: 10,
    transform: [{ translateY: -15 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente para las flechas
    padding: 10,
    borderRadius: 20,
    zIndex: 1, // Asegurarnos de que la flecha esté encima de la imagen
  },
  details: {
    marginVertical: 20,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Alinea el nombre a la izquierda y las estrellas a la derecha
    alignItems: "center", // Alinea verticalmente el nombre y las estrellas
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  starsContainer: {
    flexDirection: "row", // Asegura que las estrellas estén en una fila
    alignItems: "center", // Alinea las estrellas en el centro
  },
  description: {
    marginTop: 10,
    fontSize: 16,
  },
  mapContainer: {
    marginTop: 20,
    height: 300,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addBox: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    width: "43%",
  },
});

export default Place;
