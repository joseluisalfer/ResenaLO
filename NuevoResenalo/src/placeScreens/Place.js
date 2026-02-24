import React, { useState, useEffect, useContext, useCallback } from "react";
import { ScrollView, View, StyleSheet, Text, ActivityIndicator, Pressable, Alert } from "react-native";
import { useFocusEffect } from '@react-navigation/native'; 
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

// Local Components
import Images from "../Componentes/Place/Images/images";
import PlaceInfo from "../Componentes/Place/PlaceInfo/placeInfo";
import Map from "../Componentes/Place/Map/map";
import Review from "../Componentes/Place/Review/review";
import DeleteModal from "../placeScreens/addModalReview/DeletePlace";
import DeleteModalComment from "../placeScreens/addModalReview/DeleteComment"; 

// Utils & Services
import { getData, deleteData } from "../services/Services";
import Context from "../Context/Context";

/**
 * Place Component: Detailed view of a specific location.
 * Features: Image carousel, Map integration, Description, and a Comment feed
 * with administrative controls (Delete) if the user is the owner.
 */
const Place = ({ navigation }) => {
  const { t } = useTranslation();
  const { searchUrl, emailLogged, theme, isDark } = useContext(Context);

  const [placeData, setPlaceData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagePos, setImagePos] = useState(0);
  
  // Modal States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalCommentVisible, setIsModalCommentVisible] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const [region, setRegion] = useState({
    latitude: 0, longitude: 0, latitudeDelta: 0.01, longitudeDelta: 0.01,
  });

  /**
   * Fetches place metadata and associated user comments.
   */
  const fetchAllData = async () => {
    if (!searchUrl) return;
    try {
      const rawPlace = await getData(searchUrl);
      if (rawPlace) {
        setPlaceData(rawPlace);
        
        // Fetch comments related to this specific review ID
        const commentsUrl = `http://44.213.235.160:8080/resenalo/comment?idReview=${rawPlace.id}`;
        const responseComments = await getData(commentsUrl);
        setComments(Array.isArray(responseComments) ? responseComments : []);

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
      console.error("Critical error loading place details:", e);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllData();
  }, [searchUrl]);

  // Re-fetch when user returns to screen (e.g., after adding a comment)
  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, [searchUrl])
  );

  /**
   * Deletes a specific user comment and refreshes the list.
   */
  const handleConfirmDeleteComment = async () => {
    setIsModalCommentVisible(false);
    try {
      const deleteUrl = `http://44.213.235.160:8080/resenalo/deleteComment`;
      await deleteData(deleteUrl, { idComment: idToDelete });
      await fetchAllData(); 
      setIdToDelete(null);
    } catch (error) {
      Alert.alert(t("alerts.error"), t("alerts.deleteFailed"));
      await fetchAllData();
    }
  };

  /**
   * Deletes the entire place/review entry and returns to the previous screen.
   */
  const handleConfirmDeletePlace = async () => {
    setIsModalVisible(false);
    try {
      await deleteData(`http://44.213.235.160:8080/resenalo/deleteReview`, { idReview: placeData.id });
      navigation.goBack();
    } catch (error) {
      Alert.alert(t("alerts.error"), t("alerts.deleteFailed"));
    }
  };

  if (loading && !placeData) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary || "#2654d1"} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.background }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation & Admin Header */}
        <View style={styles.header}>
          <Ionicons 
            name="arrow-back" 
            size={28} 
            color={theme.text} 
            onPress={() => navigation.goBack()} 
          />
          {emailLogged?.results?.user === placeData?.user && (
            <Ionicons 
              name="trash-outline" 
              size={28} 
              color={isDark ? "#ff5c5c" : "#DC3545"} 
              onPress={() => setIsModalVisible(true)} 
            />
          )}
        </View>

        {/* Media Carousel */}
        <Images
          images={placeData?.images || []}
          imagePos={imagePos}
          nextImage={() => setImagePos((prev) => (placeData.images.length ? (prev + 1) % placeData.images.length : 0))}
          prevImage={() => setImagePos((prev) => (placeData.images.length ? (prev - 1 + placeData.images.length) % placeData.images.length : 0))}
        />

        {/* Info & Map Sections */}
        <PlaceInfo 
          name={placeData?.title} 
          type={placeData?.type} 
          description={placeData?.description} 
          averageRating={placeData?.valoration} 
        />
        
        <Map latitud={placeData?.latitud} longitud={placeData?.longitud} region={region} />

        {/* Community / Review Section */}
        <View style={styles.reviewSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t("stackReview.comments")}
          </Text>
          
          <Pressable
            style={styles.btnPressable}
            onPress={() => navigation.navigate("Review", { reviewId: placeData.id })}
          >
            <Text style={styles.btnText}>{t("stackReview.addComment")}</Text>
          </Pressable>

          {comments.map((item) => (
            <View 
              key={item._id || item.id} 
              style={[styles.commentRow, { borderBottomColor: isDark ? "#333" : "#f0f0f0" }]}
            >
              <View style={{ flex: 1 }}>
                <Review name={item.user} comment={item.text} stars={item.valoration} />
              </View>
              {emailLogged?.results?.user === item.user && (
                <Ionicons 
                  name="trash-outline" 
                  size={22} 
                  color="#DC3545" 
                  onPress={() => {
                    setIdToDelete(item._id || item.id);
                    setIsModalCommentVisible(true);
                  }}
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Confirmation Modals */}
      <DeleteModal 
        isVisible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        onConfirm={handleConfirmDeletePlace} 
      />
      <DeleteModalComment 
        isVisible={isModalCommentVisible} 
        onClose={() => setIsModalCommentVisible(false)} 
        onConfirm={handleConfirmDeleteComment} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 50, 
    marginBottom: 20 
  },
  reviewSection: { marginTop: 30, marginBottom: 50 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  btnPressable: { 
    backgroundColor: "#2654d1", 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: "center", 
    marginBottom: 20 
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  commentRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    paddingVertical: 10 
  }
});

export default Place;