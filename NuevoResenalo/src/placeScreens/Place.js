import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Images from "../Componentes/Place/Images/images";
import PlaceInfo from "../Componentes/Place/PlaceInfo/placeInfo";
import Map from "../Componentes/Place/Map/map";
import Review from "../Componentes/Place/Review/review";
import { getData } from "../services/services";
import Context from "../Context/Context";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const Place = ({ navigation }) => {
  const [placeData, setPlaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePos, setImagePos] = useState(0);
  const { searchUrl } = useContext(Context);
  console.log("URL recibida:", searchUrl);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  console.log(searchUrl);
  useEffect(() => {
    let isMounted = true;

    const fetchUntilReady = async () => {
      // Si no hay URL, no hay nada que hacer: se queda cargando (como pediste)
      if (!searchUrl) return;

      setLoading(true);
      setPlaceData(null);
      console.log("3");
      // Reintento infinito hasta que haya datos válidos
      while (isMounted) {
        try {
          const raw = await getData(searchUrl);
          console.log(raw);
          if (raw) {
            if (!isMounted) return;

            setPlaceData(raw);

            if (raw.latitud && raw.longitud) {
              setRegion({
                latitude: parseFloat(raw.latitud),
                longitude: parseFloat(raw.longitud),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
            }
            console.log("4");
            setImagePos(0);
            setLoading(false);
            return; 
          }
        } catch (e) {
          
        }

        await sleep(1000);
      }
    };

    fetchUntilReady();

    return () => {
      isMounted = false;
    };
  }, [searchUrl]);

  if (loading || !placeData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1748ce" />
        <Text style={styles.loadingText}>Cargando reseña...</Text>
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
    longitud,
  } = placeData;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={28}
          onPress={() => navigation.goBack()}
        />
        <Ionicons
          name="create-outline"
          size={28}
          onPress={() =>
            navigation.navigate("EditPlace", { place: placeData, searchUrl })
          }
        />
      </View>
      <Images
        images={images}
        imagePos={imagePos}
        nextImage={() =>
          setImagePos((prev) =>
            images.length ? (prev + 1) % images.length : 0,
          )
        }
        prevImage={() =>
          setImagePos((prev) =>
            images.length ? (prev - 1 + images.length) % images.length : 0,
          )
        }
      />

      <PlaceInfo
        name={apiTitle || "Sin título"}
        type={type}
        description={description}
        averageRating={valoration}
      />

      <Map latitud={latitud} longitud={longitud} region={region} />

      <View style={styles.reviewSection}>
        <Text style={styles.sectionTitle}>Reseña de {user}</Text>
        <Review name={user} comment={description} stars={valoration} />
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#333" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    marginBottom: 20,
  },
  reviewSection: { marginTop: 30, marginBottom: 50 },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  coords: { fontSize: 10, color: "#eee", textAlign: "center", marginTop: 10 },
});

export default Place;
