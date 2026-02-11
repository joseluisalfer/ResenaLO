import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Button, Text, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import ProfileImage from "../Componentes/Profile/ProfileImage/ProfileImage";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("Samuel Rodriguez");
  const [username, setUsername] = useState("@samueltrava.official");
  const [location, setLocation] = useState("Valencia, España");
  const [bio, setBio] = useState("Desarrollador móvil | Amante de las mujeres | LOL player");

  const navigation = useNavigation();

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        const storedUsername = await AsyncStorage.getItem('username');
        const storedLocation = await AsyncStorage.getItem('location');
        const storedBio = await AsyncStorage.getItem('bio');

        if (storedName) setName(storedName);
        if (storedUsername) setUsername(storedUsername);
        if (storedLocation) setLocation(storedLocation);
        if (storedBio) setBio(storedBio);
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    };
    loadProfileData();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('location', location);
      await AsyncStorage.setItem('bio', bio);

      console.log("Perfil guardado:", { name, username, location, bio });
      navigation.goBack();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    navigation.goBack(); // Vuelve a la pantalla anterior
  };

  return (
    <ScrollView style={styles.container}>
      {/* Imagen de perfil */}
      <View style={styles.profileImageContainer}>
        <ProfileImage image={image} setImage={setImage} />
      </View>

      <View style={styles.inputContainer}>
        {/* Campos de edición */}
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Ubicación"
          value={location}
          onChangeText={setLocation}
        />
        <TextInput
          style={styles.input}
          placeholder="Biografía"
          value={bio}
          onChangeText={setBio}
          multiline
        />
      </View>

      {/* Botones de acción */}
      <View style={styles.buttonsContainer}>
        <Button title="Guardar Cambios" onPress={handleSave} />
        <Button title="Cancelar" onPress={handleCancel} color="gray" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 15,
    fontSize: 16,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default EditProfile;
