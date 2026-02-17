import React, { useState, useContext } from "react";
import Context from "../../../Context/Context";
import { View, Pressable, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

const ProfileImage = () => {
  const { emailLogged } = useContext(Context);
  const [base64Image, setBase64Image] = useState(emailLogged.results.photo); // Estado para la imagen en base64

  // Función para manejar la imagen y detectar si es URL o Base64
  const getImageUri = (rawPhoto) => {
    if (rawPhoto) {
      if (rawPhoto.startsWith("data:image")) {
        return rawPhoto; // Si es Base64
      } else if (rawPhoto.startsWith("http")) {
        return rawPhoto; // Si es una URL
      } else {
        return `data:image/jpeg;base64,${rawPhoto}`; // Si es Base64 sin prefijo
      }
    }
    return null;
  };

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
            const base64 = await toBase64(result.assets[0].uri);
            setBase64Image(base64); // Almacena la imagen en base64 en el estado
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
            const base64 = await toBase64(result.assets[0].uri);
            setBase64Image(base64); // Almacena la imagen en base64 en el estado
          }
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
      reader.readAsDataURL(blob); // Convierte la imagen a Base64
    });
  };

  const imageUri = getImageUri(base64Image); // Obtiene la URI correcta (Base64 o URL)

  return (
    <View style={styles.container}>
      <Pressable onPress={seleccionarImagen} style={styles.photoSquare}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.photo} />
        ) : (
          <View style={styles.placeholder}>
            {/* Aquí podrías poner un texto o un fondo predeterminado si no se ha cargado ninguna imagen */}
            <Text style={styles.photoText}>Imagen de perfil</Text>
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
    backgroundColor: "#ddd",
    borderRadius: 60,
  },
  photoText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});

export default ProfileImage;
