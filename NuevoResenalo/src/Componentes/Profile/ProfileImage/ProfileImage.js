import React, { useState, useContext, useEffect } from "react";
import Context from "../../../Context/Context";
import {
  View,
  Pressable,
  Image,
  Alert,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const ProfileImage = () => {
  // 1. Extraemos theme e isDark del Context
  const { emailLogged, setEmailLogged, theme, isDark } = useContext(Context);

  const userEmail = emailLogged?.results?.email || null;
  const currentImage = emailLogged?.results?.photo || emailLogged?.results?.image || null;

  const [imageUri, setImageUri] = useState(currentImage);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setImageUri(currentImage);
  }, [currentImage]);

  const toBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64String = reader.result;
        const cleanBase64 = String(base64String).split(",")[1] || "";
        resolve(cleanBase64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const putPhoto = async ({ email, file }) => {
    const url = "http://44.213.235.160:8080/resenalo/updatePhoto";
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, file }),
    });

    const raw = await res.text().catch(() => "");
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${raw || "sin body"}`);

    try {
      return JSON.parse(raw);
    } catch {
      return { imageUrl: raw };
    }
  };

  const handleUpdatePhoto = async (uri) => {
    try {
      if (!userEmail) {
        Alert.alert("Error", "No hay sesión.");
        return;
      }
      setUpdating(true);
      const base64Clean = await toBase64(uri);
      if (!base64Clean || base64Clean.length < 50) {
        Alert.alert("Error", "Imagen inválida.");
        return;
      }

      const serverResponse = await putPhoto({
        email: userEmail,
        file: base64Clean,
      });

      const publicUrl = serverResponse?.imageUrl;
      if (!publicUrl || !String(publicUrl).startsWith("http")) {
        Alert.alert("Error", "El servidor no devolvió una URL válida.");
        return;
      }

      setImageUri(publicUrl);
      setEmailLogged((prev) => ({
        ...prev,
        results: {
          ...(prev?.results || {}),
          photo: publicUrl,
          image: publicUrl,
        },
      }));
    } catch (e) {
      Alert.alert("Error", "No se pudo subir la imagen.");
    } finally {
      setUpdating(false);
    }
  };

  const seleccionarImagen = async () => {
    if (!userEmail) return Alert.alert("Error", "No hay sesión.");

    Alert.alert("Cambiar imagen de perfil", "Elige una opción", [
      {
        text: "Galería",
        onPress: async () => {
          const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!perm.granted) return Alert.alert("Permiso", "Se requiere permiso de galería.");
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
          });
          if (!result.canceled) handleUpdatePhoto(result.assets[0].uri);
        },
      },
      {
        text: "Cámara",
        onPress: async () => {
          const perm = await ImagePicker.requestCameraPermissionsAsync();
          if (!perm.granted) return Alert.alert("Permiso", "Se requiere permiso de cámara.");
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
          });
          if (!result.canceled) handleUpdatePhoto(result.assets[0].uri);
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 2. El círculo cambia el color del borde según el tema */}
      <Pressable
        onPress={seleccionarImagen}
        style={[
          styles.photoSquare,
          { 
            borderColor: isDark ? "#444" : "#ccc", 
            backgroundColor: isDark ? "#222" : "#f5f5f5" 
          }
        ]}
        disabled={updating}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.photo} />
        ) : (
          /* 3. Placeholder adaptado */
          <View style={[styles.placeholder, { backgroundColor: isDark ? "#333" : "#ddd" }]}>
            <Text style={[styles.photoText, { color: isDark ? "#aaa" : "#888" }]}>Subir foto</Text>
          </View>
        )}

        {updating && (
          /* 4. Overlay de carga adaptado al modo oscuro */
          <View style={[
            styles.loadingOverlay, 
            { backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)" }
          ]}>
            <ActivityIndicator color={theme.primary || "#1748ce"} size="small" />
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 35, alignItems: "center" },
  photoSquare: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2, // Un poco más grueso para que resalte en el fondo negro
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  photo: { width: "100%", height: "100%" },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  photoText: { fontSize: 14 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileImage;