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
import DatosPublish from "../Componentes/Publish/PublishData/PublishData"; // Formulario
import SelectorImagen from "../Componentes/Publish/ImageSelector/imageSelector"; // Selector de imágenes
import { useTranslation } from "react-i18next";
import "../../assets/i18n/index";
import { postData } from "../services/services"; // Asegúrate de que esta ruta sea correcta
import Context from "../Context/Context";

const Publish = () => {
  const [imagenes, setImagenes] = useState([null]); // Estado para almacenar las imágenes
  const { t } = useTranslation();
  const { publishInfo, setPublishInfo } = useContext(Context);
  const { emailLogged} = useContext(Context);

  // Función para convertir las imágenes a base64
  const convertImageToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        let base64 = reader.result;
        // Eliminar el prefijo 'data:image/png;base64,' (o cualquier otro tipo)
        base64 = base64.split(",")[1]; // Tomamos solo la parte después de la coma
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Función para enviar los datos cuando el usuario hace clic en el botón "Añadir mapa"
  const handleAddMap = async () => {
    const { title, coords, type, description, valoration } = publishInfo;

    // Validar que todos los campos estén presentes
    if (
      !title ||
      !coords ||
      !type ||
      !description ||
      !valoration ||
      !imagenes.length ||
      !imagenes[0]
    ) {
      alert(
        "Por favor, completa todos los campos y asegúrate de haber agregado una imagen.",
      );
      return;
    }

    // Validar que el campo de ubicación tenga el formato correcto
    if (!coords.includes(",")) {
      alert(
        "Por favor, ingresa las coordenadas en el formato correcto (latitud,longitud).",
      );
      return;
    }

    // Convertir las imágenes a base64
    const base64Images = await Promise.all(
      imagenes
        .filter((img) => img !== null)
        .map((img) => convertImageToBase64(img.uri)),
    );

    // Crear el objeto con todos los datos del formulario usando `publishInfo` y las imágenes convertidas a base64
    const data = {
      title: title,
      user: emailLogged.results.user, // Aquí puedes obtener el usuario de alguna forma, tal vez del contexto o autenticación
      valoration: valoration,
      description: description,
      type: type,
      coords: coords, // Enviamos la ubicación tal cual (latitud,longitud)
      files: base64Images, // Aseguramos que las imágenes sean base64
    };

    // Imprimir los datos antes de enviarlos para depuración
    console.log("Datos a enviar:", JSON.stringify(data));

    try {
      const response = await postData(
        "http://44.213.235.160:8080/first/uploadReview",
        data,
      );
      if (response === null) {
        alert("Reseña publicada con éxito.");
      } else {
        alert("Hubo un error al publicar la reseña.");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert(
        "Hubo un error al enviar los datos. Por favor, inténtalo de nuevo.",
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 120,
          }}
        >
          <Text style={styles.title}>{t("publishScreen.new_place")}</Text>

          {/* Formulario de publicación */}
          <DatosPublish setFormData={setPublishInfo} />

          {/* Selector de imágenes */}
          <SelectorImagen imagenes={imagenes} setImagenes={setImagenes} />
        </ScrollView>

        {/* Botón para eliminar las fotos */}
        <Pressable style={styles.removeButton} onPress={() => setImagenes([null])}>
          <Text style={styles.buttonText}>Eliminar fotos</Text>
        </Pressable>
        {/* Botón para "Añadir mapa" y enviar los datos al backend */}
        <Pressable style={styles.button} onPress={handleAddMap}>
          <Text style={styles.buttonText}>{t("publishScreen.buttonAdd")}</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 12,
  },
  button: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#1748ce",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  removeButton: {
    position: "absolute",
    bottom: 80, // Un poco arriba del botón de "Añadir mapa"
    left: 16,
    right: 16,
    backgroundColor: "#DC3545", // Color rojo para eliminar
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default Publish;
