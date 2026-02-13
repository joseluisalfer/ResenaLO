import React, { useState } from "react";
import { View, StyleSheet, FlatList, Text, Modal, Pressable } from "react-native";
import { Button, Card, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; // Asegúrate de que importas useNavigation
import { Ionicons } from '@expo/vector-icons';
import ProfileImage from "../Componentes/Profile/ProfileImage/ProfileImage";
import { useTranslation } from 'react-i18next';
import '../../assets/i18n/index';

const mockPosts = [
  {
    id: "1",
    title: "Mi primera publicación",
    content: "Mi gran verano en 2024...",
  },
  { id: "2", title: "Un gran día", content: "La perdí con un trabajo..." },
  {
    id: "3",
    title: "React Native 🚀",
    content: "Me encanta desarrollar apps móviles.",
  },
];

const Profile = () => {
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false); // Para manejar si mostrar opciones de idioma
  const [selectedLanguage, setSelectedLanguage] = useState("Español");
  const [isLanguageChanged, setIsLanguageChanged] = useState(false);
  const navigation = useNavigation();  // Usar el hook para navegación
  const { t, i18n } = useTranslation();


  const renderPost = ({ item }) => (
    <Card style={styles.postCard}>
      <Card.Content>
        <Text variant="titleMedium">{item.title}</Text>
        <Text variant="bodyMedium" style={{ marginTop: 4 }}>
          {item.content}
        </Text>
      </Card.Content>
    </Card>
  );

  const handleLogOut = () => {
    console.log("Log Out clicked");
    setModalVisible(false);
  };

  const handleChangeLanguage = (language) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language); // Actualiza el idioma seleccionado
    setIsLanguageChanged(true); // Marca que el idioma ha cambiado
  };

  const handleExitLanguageChange = () => {
    setModalVisible(false);
    setShowLanguageOptions(false); 
  };

  const handleChangeToLanguageSelection = () => {
    setShowLanguageOptions(true); // Al presionar Cambiar Idioma, se muestran solo las opciones de idioma
  };

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.container}>
          {/* Icono de configuración (tuerca) */}
          <View style={styles.iconContainer}>
            <Pressable onPress={() => setModalVisible(true)}>
              <Ionicons name="settings-outline" size={30} color="black" />
            </Pressable>
          </View>

          {/* Modal de opciones */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {!showLanguageOptions ? (
                  <>
                    {/* Opciones generales como Cambiar Tema, Log Out */}
                    <Button onPress={handleLogOut} mode="outlined" style={styles.modalButton}>
                      <Text>{t("profile.logout")}</Text>
                    </Button>
                    <Button onPress={handleChangeToLanguageSelection} mode="outlined" style={styles.modalButton}>
                      <Text>{t("profile.change_lang")}</Text>
                    </Button>
                    <Button mode="outlined" style={styles.modalButton}>
                      <Text>{t("profile.change_theme")}</Text>
                    </Button>
                    <Button onPress={() => setModalVisible(false)} mode="outlined" style={styles.modalButton}>
                      <Text>{t("profile.cancel")}</Text>
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Solo mostrar idiomas y guardar */}
                    <Text style={styles.modalTitle}>{t("profile.title")} </Text>
                    <Pressable
                      onPress={() => handleChangeLanguage("es")}
                      style={[
                        styles.languageOption,
                        selectedLanguage === "es" && styles.selectedLanguage
                      ]}
                    >
                      <Text>{t("language.sp")}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleChangeLanguage("ca")}
                      style={[
                        styles.languageOption,
                        selectedLanguage === "ca" && styles.selectedLanguage
                      ]}
                    >
                      <Text>{t("language.ca")}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleChangeLanguage("en")}
                      style={[
                        styles.languageOption,
                        selectedLanguage === "en" && styles.selectedLanguage
                      ]}
                    >
                      <Text>{t("language.en")}</Text>
                    </Pressable>

                    <Pressable onPress={handleExitLanguageChange}>
                      <Text style={styles.cancelButton}>{t("profile.cancel")}</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          </Modal>

          {/* Imagen de perfil */}
          <ProfileImage image={image} setImage={setImage} />

          <View style={{ alignItems: "center" }}>
            <Text variant="bodyMedium" style={styles.username}>
              @samueltrava.official
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text variant="headlineSmall" style={styles.name}>
              Samuel Rodriguez
            </Text>

            <Text variant="bodyMedium" style={styles.ubication}>
              Valencia, España
            </Text>

            <Text variant="bodyMedium" style={styles.bio}>
              Desarrollador móvil | Amante de las mujeres | LOL player
            </Text>
          </View>

          {/* Botón de editar perfil */}
          <Button
            mode="contained"
            onPress={() => navigation.navigate("EditProfile")}
            style={styles.editButton}
          >
            <Text>{t("profile.buttonEdit")}</Text>
          </Button>

          {/* Estadísticas */}
          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text variant="titleMedium">24</Text>
                <Text variant="bodySmall">{t("profile.post")}</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleMedium">100</Text>
                <Text variant="bodySmall">{t("profile.comments")}</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleMedium">30</Text>
                <Text variant="bodySmall">{t("profile.friends")}</Text>
              </View>
            </Card.Content>
          </Card>

          <Divider style={{ marginVertical: 16 }} />

          <Text variant="titleLarge" style={{ marginBottom: 8 }}>
            {t("profile.post")}
          </Text>
        </View>
      }
      data={mockPosts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginTop: 40,
  },
  // Contenedor para el ícono de la tuerca (settings)
  iconContainer: {
    width: "100%",
    alignItems: "flex-end",
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",  // Fondo oscuro para el modal
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",  // Ancho del modal
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  languageOption: {
    fontSize: 16,
    marginVertical: 10,
    color: "blue",
  },
  buttonContainer: {
    marginTop: 20,
  },
  cancelButton: {
    color: "red",
    textAlign: "center",
    marginTop: 15,
  },
  modalButton: {
    marginBottom: 10,
  },
  postCard: {
    marginBottom: 12,
  },
  editButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: 200,
    alignSelf: "center",
  },
  username: {
    color: "gray",
    marginTop: 3,
  },
  name: {
    marginTop: 12,
    fontWeight: "bold",
  },
  ubication: {
    color: "gray",
    marginTop: 0,
  },
  bio: {
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  statsCard: {
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
  },
  statItem: {
    alignItems: "center",
  },
  selectedLanguage: {
    backgroundColor: '#d3d3d3', // Un color de fondo al seleccionar
    borderRadius: 5,             // Agregar bordes redondeados
    padding: 5,                  // Espaciado extra dentro del botón
  },
});

export default Profile;
