import React, { useState } from "react";
import { View, Pressable, Text, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

const ProfileImage = ({ image, setImage }) => {
  const seleccionarImagen = async () => {
    Alert.alert("Cambiar imagen de perfil", "Elige una opción", [
      {
        text: "Galería",
        onPress: async () => {
          const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permissionResult.granted) {
            Alert.alert("Necesitamos permisos para acceder a la galería");
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
          });

          if (!result.canceled) {
            // Si se selecciona una imagen, la conviertes a base64
            const base64Image = await toBase64(result.assets[0].uri);
            setImage(base64Image); // Actualizamos el estado con la nueva imagen
          }
        },
      },
      {
        text: "Cámara",
        onPress: async () => {
          const permissionResult =
            await ImagePicker.requestCameraPermissionsAsync();
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
            // Convertir la imagen a Base64 si se toma una foto
            const base64Image = await toBase64(result.assets[0].uri);
            setImage(base64Image); // Actualizamos el estado con la nueva imagen
          }
        },
      },
      {
        text: "Eliminar foto de perfil",
        onPress: () => {
          setImage(null); // Eliminar la imagen
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  // Función para convertir una imagen en URI a Base64
  const toBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result); // Devolvemos la imagen en formato Base64
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);  // Convierte la imagen a Base64
    });
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={seleccionarImagen} style={styles.photoSquare}>
        {/* Si hay imagen (Base64), la mostramos dentro del círculo */}
        {image ? (
          <Image source={{ uri: image }} style={styles.photo} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.plus}>+</Text>
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
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  plus: {
    fontSize: 40,
    color: "#aaa",
    fontWeight: "bold",
  },
});

export default ProfileImage;
