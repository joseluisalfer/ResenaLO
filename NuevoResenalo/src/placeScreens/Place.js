import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, ActivityIndicator, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Images from '../Componentes/Place/Images/images';
import PlaceInfo from '../Componentes/Place/PlaceInfo/placeInfo';
import Map from '../Componentes/Place/Map/map';
import Review from '../Componentes/Place/Review/review';
import { getData } from '../services/services';

const Place = ({ navigation, route }) => {
  const [placeData, setPlaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePos, setImagePos] = useState(0);
  const [title, setTitle] = useState("Unai");

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        setLoading(true);
        const data = await getData(`http://44.213.235.160:8080/first/reviewPlace?title=${title}`);
        
        if (data) {
          const result = Array.isArray(data) ? data[0] : data;
          setPlaceData(result);
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar el lugar");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceData();
  }, [title]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1748ce" />
      </View>
    );
  }

  if (!placeData) {
    return (
      <View style={styles.center}>
        <Text>Lugar no encontrado</Text>
      </View>
    );
  }

  const { 
    title: apiTitle, 
    type, 
    images = [], 
    user, 
    valoration, 
    description,
    latitud,
    longitud 
  } = placeData;

  const handleNext = () => setImagePos((imagePos + 1) % images.length);
  const handlePrev = () => setImagePos((imagePos - 1 + images.length) % images.length);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color="black" onPress={() => navigation.goBack()} />
        <Ionicons name="create-outline" size={28} color="black" onPress={() => navigation.navigate('EditPlace', { place: placeData })} />
      </View>

      <Images 
        images={images} 
        imagePos={imagePos} 
        nextImage={handleNext} 
        prevImage={handlePrev} 
      />

      <PlaceInfo
        name={apiTitle}
        description={type}
        averageRating={valoration}
      />

      <Map latitud={latitud} longitud={longitud} />

      <Pressable style={styles.addButton} onPress={() => navigation.navigate('Review')}>
        <Text style={styles.addButtonText}>Añadir reseña</Text>
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
      </Pressable>

      <View style={styles.reviewSection}>
        <Text style={styles.sectionTitle}>Reseña destacada</Text>
        <Review
          name={user}
          comment={description}
          stars={valoration}
        />
        <Text style={styles.coords}>{latitud}, {longitud}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#1748ce",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },
  reviewSection: { marginTop: 30, marginBottom: 50 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  coords: { fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 15 }
});

export default Place;
