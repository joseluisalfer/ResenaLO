import React, { useState, useContext } from "react";
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Text,
  StyleSheet,
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
  
  // Extraemos theme e isDark para controlar los colores dinámicamente
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

    if (
      !title ||
      !coords ||
      !type ||
      !description ||
      !valoration ||
      !imagenes.length ||
      !imagenes[0]
    ) {
      alert("Por favor, completa todos los campos y asegúrate de haber agregado una imagen.");
      return;
    }

    if (!coords.includes(",")) {
      alert("Por favor, ingresa las coordenadas en el formato correcto (latitud,longitud).");
      return;
    }

    const base64Images = await Promise.all(
      imagenes
        .filter((img) => img !== null)
        .map((img) => convertImageToBase64(img.uri)),
    );

    const data = {
      title: title,
      user: emailLogged?.results?.user || "Anónimo", 
      valoration: valoration,
      description: description,
      type: type,
      coords: coords, 
      files: base64Images, 
    };

    try {
      const response = await postData(
        "http://44.213.235.160:8080/resenalo/uploadReview",
        data,
      );
      if (response === null) {
        alert("Reseña publicada con éxito.");
      } else {
        alert("Hubo un error al publicar la reseña.");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Hubo un error al enviar los datos. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* Contenedor principal con fondo negro del tema */}
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <ScrollView
          style={{ backgroundColor: theme.background }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 160, // Espacio extra para que los botones no tapen el contenido
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Título en blanco */}
          <Text style={[styles.title, { color: theme.text }]}>
            {t("publishScreen.new_place")}
          </Text>

          {/* Formulario de publicación */}
          <DatosPublish setFormData={setPublishInfo} />

          {/* Selector de imágenes */}
          <SelectorImagen imagenes={imagenes} setImagenes={setImagenes} />
        </ScrollView>

        {/* Botón para eliminar las fotos (Rojo oscuro en Dark Mode) */}
        <Pressable 
          style={[styles.removeButton, { backgroundColor: isDark ? "#8B0000" : "#DC3545" }]} 
          onPress={() => setImagenes([null])}
        >
          <Text style={styles.buttonText}>Eliminar fotos</Text>
        </Pressable>

        {/* Botón principal */}
        <Pressable style={styles.button} onPress={handleAddMap}>
          <Text style={styles.buttonText}>{t("publishScreen.buttonAdd")}</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  button: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#1748ce",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  removeButton: {
    position: "absolute",
    bottom: 85, 
    left: 16,
    right: 16,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
});

export default Publish;