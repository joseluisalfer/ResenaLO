import React, { useState, useContext } from "react";
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DatosPublish from "../Componentes/Publish/PublishData/PublishData"; 
import SelectorImagen from "../Componentes/Publish/ImageSelector/imageSelector"; 
import { useTranslation } from "react-i18next";
import "../../assets/i18n/index";
import { postData } from "../services/Services"; 
import Context from "../Context/Context";

const Publish = () => {
  const [imagenes, setImagenes] = useState([null]); 
  const { t } = useTranslation();
  const { publishInfo, setPublishInfo, emailLogged, theme, isDark } = useContext(Context);

  const convertImageToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        let base64 = reader.result;
        base64 = base64.split(",")[1]; 
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleAddMap = async () => {
    const { title, coords, type, description, valoration } = publishInfo;

    if (!title || !coords || !type || !description || !valoration || !imagenes[0]) {
      alert("Por favor, completa todos los campos y agrega una imagen.");
      return;
    }

    const base64Images = await Promise.all(
      imagenes.filter((img) => img !== null).map((img) => convertImageToBase64(img.uri)),
    );

    const data = {
      title,
      user: emailLogged?.results?.user || "Anónimo", 
      valoration,
      description,
      type,
      coords, 
      files: base64Images, 
    };

    try {
      const response = await postData("http://44.213.235.160:8080/resenalo/uploadReview", data);
      if (response === null) {
        alert("Reseña publicada con éxito.");
      } else {
        alert("Hubo un error al publicar.");
      }
    } catch (error) {
      alert("Error de conexión.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { backgroundColor: theme.background }
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]}>
            {t("publishScreen.new_place")}
          </Text>

          {/* Formulario de datos */}
          <DatosPublish setFormData={setPublishInfo} />

          {/* Selector de imágenes */}
          <SelectorImagen imagenes={imagenes} setImagenes={setImagenes} />

          {/* CONTENEDOR DE BOTONES AL FINAL DEL SCROLL */}
          <View style={styles.buttonContainer}>
            
            {/* Botón Eliminar Fotos - Recuperado el estilo rojo */}
            <Pressable 
              style={[styles.removeButton, { backgroundColor: isDark ? "#A52A2A" : "#DC3545" }]} 
              onPress={() => setImagenes([null])}
            >
              <Text style={styles.buttonText}>Eliminar fotos</Text>
            </Pressable>

            {/* Botón Publicar - Azul */}
            <Pressable style={styles.button} onPress={handleAddMap}>
              <Text style={styles.buttonText}>{t("publishScreen.buttonAdd")}</Text>
            </Pressable>
          </View>
          
          {/* Espacio extra final para asegurar que se vea todo al hacer scroll */}
          <View style={{ height: 50 }} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  button: {
    backgroundColor: "#1748ce",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  removeButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default Publish;