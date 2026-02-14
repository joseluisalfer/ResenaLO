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

  const { title } = route.params || { title: 'ParkingMcDonaldsAlbal' };

  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        setLoading(true);
        const data = await getData(`http://44.213.235.160:8080/first/reviewPlace?title=${title}`);

        if (data && data.reviews && data.reviews.length > 0) {
          const item = data.reviews[0];
          setPlaceData(item);

          if (item.latitud && item.longitud) {
            setRegion({
              latitude: parseFloat(item.latitud),
              longitude: parseFloat(item.longitud),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }
        setLoading(false);
      } catch (error) {
        Alert.alert("Error", "No se pudo obtener la información");
      }
    };

    fetchPlaceData();
  }, [title]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#1748ce" /></View>;
  if (!placeData) return <View style={styles.center}><Text>No se encontraron reviews</Text></View>;

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} onPress={() => navigation.goBack()} />
        <Ionicons name="create-outline" size={28} onPress={() => navigation.navigate('EditPlace', { place: placeData })} />
      </View>

      <Images
        images={images}
        imagePos={imagePos}
        nextImage={() => setImagePos((imagePos + 1) % images.length)}
        prevImage={() => setImagePos((imagePos - 1 + images.length) % images.length)}
      />

      <PlaceInfo
        name={apiTitle || title}
        type={type}
        description={description}
        averageRating={valoration}
      />

      <Map
        latitud={placeData.latitud}
        longitud={placeData.longitud}
      />

      <Pressable style={styles.addButton} onPress={() => navigation.navigate('Review')}>
        <Text style={styles.addButtonText}>Añadir reseña</Text>
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
      </Pressable>

      <View style={styles.reviewSection}>
        <Text style={styles.sectionTitle}>Reseña de {user}</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 50, marginBottom: 20 },
  addButton: {
    backgroundColor: "#1748ce",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "600", marginRight: 10 },
  reviewSection: { marginTop: 30, marginBottom: 50 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  coords: { fontSize: 10, color: '#eee', textAlign: 'center', marginTop: 10 }
});

export default Place;