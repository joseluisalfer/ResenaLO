import React from "react";
import { View, Pressable, Text, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

const ProfileImage = ({ image, setImage }) => {
  const seleccionarImagen = async () => {
    Alert.alert("Cambiar imagen de perfil", "Elige una opción", [
      {
        text: "Galería",
        onPress: async () => {
          const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permissionResult.granted) {
            Alert.alert("Necesitamos permisos para acceder a la galería");
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
          });

          if (!result.canceled) {
            setImage(result.assets[0].uri); // Cambiar la imagen
          }
        },
      },
      {
        text: "Cámara",
        onPress: async () => {
          const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
          if (!permissionResult.granted) {
            Alert.alert("Necesitamos permisos para usar la cámara");
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

          if (!result.canceled) {
            setImage(result.assets[0].uri); // Cambiar la imagen
          }
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={seleccionarImagen} style={styles.photoSquare}>
        {image ? (
          <Image source={{ uri: image }} style={styles.photo} />
        ) : null} {/* Solo muestra la imagen si hay una establecida */}

        {/* Mostrar el círculo con el '+' solo cuando haya imagen */}
        {image && (
          <View style={styles.addButtonContainer}>
            <Text style={styles.addButton}>+</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 35,
    alignItems: "center",
  },
  photoSquare: {
    width: 120,
    height: 120,
    borderRadius: 60, // Hace que sea un círculo
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    position: "relative", // Necesario para posicionar el '+' encima
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#6200ea", // Color del círculo con el '+'
    borderRadius: 15,
    padding: 5,
  },
  addButton: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileImage;
