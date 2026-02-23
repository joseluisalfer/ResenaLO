import React, { useState, useContext } from 'react';
import { View, Text, Keyboard, StyleSheet, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';
import Context from '../../../Context/Context';

const FormInput = ({ label, placeholder, value, onChangeText }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      mode="outlined"
      placeholder={placeholder}
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={Keyboard.dismiss}
      dense
    />
  </View>
);

const DatosPublish = () => {
  const { t } = useTranslation();
  const { publishInfo, setPublishInfo } = useContext(Context);

  // State for form fields
  const [title, setTitle] = useState(publishInfo.title);
  const [ubication, setUbication] = useState(publishInfo.coords); // Coordinates as "latitude,longitude"
  const [type, setType] = useState(publishInfo.type);
  const [description, setDescription] = useState(publishInfo.description);
  const [rating, setRating] = useState(publishInfo.valoration);

  // Handle the change in each field and update the context
  const handleTitleChange = (text) => {
    setTitle(text);
    setPublishInfo({ ...publishInfo, title: text });
  };

  const handleUbicationChange = (text) => {
    setUbication(text);
    setPublishInfo({ ...publishInfo, coords: text });
  };

  const handleTypeChange = (text) => {
    setType(text);
    setPublishInfo({ ...publishInfo, type: text });
  };

  const handleDescriptionChange = (text) => {
    setDescription(text);
    setPublishInfo({ ...publishInfo, description: text });
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setPublishInfo({ ...publishInfo, valoration: newRating });
  };

  // Render stars for rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Pressable key={i} onPress={() => handleRatingChange(i)}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={40}
            color={i <= rating ? 'gold' : 'gray'}
          />
        </Pressable>
      );
    }
    return stars;
  };

  // Function to reset the form and context after successful submission
  const resetForm = () => {
    setTitle("");
    setUbication("");
    setType("");
    setDescription("");
    setRating(0);

    setPublishInfo({
      title: "",
      coords: "",
      type: "",
      description: "",
      valoration: 0,
    });
  };

  return (
    <View style={styles.container}>
      <FormInput label="Nombre del lugar" placeholder="Nuevo lugar" value={title} onChangeText={handleTitleChange} />
      <FormInput label="Ubicación (latitud,longitud)" placeholder="Ejemplo: 40.7128,-74.0060" value={ubication} onChangeText={handleUbicationChange} />
      <FormInput label="Tipo" placeholder="Tipo de lugar" value={type} onChangeText={handleTypeChange} />
      <FormInput label="Descripción" placeholder="Descripción del lugar" value={description} onChangeText={handleDescriptionChange} />

      {/* Render stars for rating */}
      <View style={styles.starContainer}>
        {renderStars()}
      </View>

      {/* Add a button to trigger the form reset */}
      <Pressable style={styles.resetButton} onPress={resetForm}>
        <Text style={styles.buttonText}>Restablecer</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    width: 120,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: 'transparent',
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#DC3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default DatosPublish;
