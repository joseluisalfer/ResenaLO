import React, { useState } from "react";
import { View, StyleSheet, TextInput, Text, FlatList, Image, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import ProfileImage from "../../Componentes/Profile/ProfileImage/ProfileImage";
import { useTranslation } from 'react-i18next'
import '../../../assets/i18n/index';
const EditPlace = () => {

  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(""); 
  const [longitude, setLongitude] = useState(""); 
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState([
    require('../../../assets/images/Konoha.png'),
    require('../../../assets/images/Konoha.png'),
    require('../../../assets/images/Konoha.png'),
  ]);

  const { t } = useTranslation();

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSave = () => {
    console.log("Cambios guardados:", { name, description, latitude, longitude, rating });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageWrapper}>
      <Image source={item} style={styles.image} />
      {item !== "addImage" && (
        <Pressable onPress={() => handleRemoveImage(index)} style={styles.removeImage}>
          <Text style={styles.removeImageText}>✖</Text>
        </Pressable>
      )}
    </View>
  );

  const handleAddImage = (uri) => {
    setImages(prevImages => [...prevImages, uri]); 
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.locationTitle}>Ubicación:</Text>
        <TextInput
          style={styles.input}
          placeholder="Latitud"
          value={latitude}
          onChangeText={setLatitude}
        />
        <TextInput
          style={styles.input}
          placeholder="Longitud"
          value={longitude}
          onChangeText={setLongitude}
        />
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingTitle}>Calificación</Text>
        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => handleRatingChange(star)}>
              <Text style={rating >= star ? styles.starActive : styles.starInactive}>★</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Text style={styles.imageTitle}>Imágenes</Text>
        <FlatList
          data={[...images, "addImage"]}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
        <ProfileImage image={null} setImage={handleAddImage} />
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable style={styles.addReviewButton} onPress={handleSave}>
          <Text style={styles.addReviewButtonText}>Guardar Cambios</Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>
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
  descriptionInput: {
    height: 150,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: 'row',
  },
  starActive: {
    fontSize: 30,
    color: 'gold',
    marginRight: 5,
  },
  starInactive: {
    fontSize: 30,
    color: 'gray',
    marginRight: 5,
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 50,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 14,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: "column",
    alignItems: "center",
  },
  addReviewButton: {
    backgroundColor: '#2654d1',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  addReviewButtonText: {
    color: 'white',
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: '#DC3545',
    padding: 8,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EditPlace;
