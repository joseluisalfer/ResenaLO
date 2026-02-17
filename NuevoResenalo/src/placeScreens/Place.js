import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Images from "../Componentes/Place/Images/images";
import PlaceInfo from "../Componentes/Place/PlaceInfo/placeInfo";
import Map from "../Componentes/Place/Map/map";
import Review from "../Componentes/Place/Review/review";
import { getData } from "../services/services";
import Context from "../Context/Context";

const Place = ({ navigation }) => {
  const [placeData, setPlaceData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagePos, setImagePos] = useState(0);
  const { searchUrl, emailLogged } = useContext(Context);
  
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!searchUrl) return;

      setLoading(true);
      try {
        const rawPlace = await getData(searchUrl);
        
        if (rawPlace && isMounted) {
          setPlaceData(rawPlace);

          const currentId = rawPlace.id || rawPlace._id;
          const commentsUrl = `http://44.213.235.160:8080/resenalo/comment?idReview=${currentId}`;
          const responseComments = await getData(commentsUrl);

          if (responseComments && Array.isArray(responseComments)) {
            setComments(responseComments);
          } else {
            setComments([]);
          }

          if (rawPlace.latitud && rawPlace.longitud) {
            setRegion({
              latitude: parseFloat(rawPlace.latitud),
              longitude: parseFloat(rawPlace.longitud),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [searchUrl]);

  if (loading || !placeData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2654d1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} onPress={() => navigation.goBack()} />
        <Ionicons
          name="create-outline"
          size={28}
          onPress={() => navigation.navigate("EditPlace")}
        />
      </View>

      <Images
        images={placeData.images || []}
        imagePos={imagePos}
        nextImage={() => setImagePos((prev) => (placeData.images.length ? (prev + 1) % placeData.images.length : 0))}
        prevImage={() => setImagePos((prev) => (placeData.images.length ? (prev - 1 + placeData.images.length) % placeData.images.length : 0))}
      />

      <PlaceInfo
        name={placeData.title || "Sin título"}
        type={placeData.type}
        description={placeData.description}
        averageRating={placeData.valoration}
      />

      <Map latitud={placeData.latitud} longitud={placeData.longitud} region={region} />

      <View style={styles.reviewSection}>
        <Text style={styles.sectionTitle}>COMENTARIOS</Text>
        
        <Pressable
          style={styles.btnPressable}
          onPress={() =>
            navigation.navigate("Review", {
              reviewId: placeData.id || placeData._id,
              user: emailLogged.user
            })
          }
        >
          <Text style={styles.btnText}>AÑADIR RESEÑA</Text>
        </Pressable>

        {comments.length > 0 ? (
          comments.map((item) => (
            <Review 
              key={item._id} 
              name={item.user} 
              comment={item.text} 
              stars={item.valoration} 
            />
          ))
        ) : (
          <Text style={styles.noCommentsText}>No hay reseñas.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", marginTop: 50, marginBottom: 20 },
  reviewSection: { marginTop: 30, marginBottom: 50 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  btnPressable: {
    backgroundColor: "#2654d1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  noCommentsText: { textAlign: 'center', color: '#999', fontStyle: 'italic' }
});

export default Place;