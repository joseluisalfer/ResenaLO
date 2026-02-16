import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const Explore = ({ navigation }) => {
  const [reviewsUrls, setReviewsUrls] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://44.213.235.160:8080/resenalo/randomReviews')
      .then(response => response.json())
      .then(data => setReviewsUrls(data))
      .catch(error => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (reviewsUrls.length > 0) {
      const fetchReviewDetails = async () => {
        try {
          const reviews = await Promise.all(
            reviewsUrls.map(async (url) => {
              const response = await fetch(url);
              return await response.json();
            })
          );
          setReviewsData(reviews);
        } catch (error) {
          console.error("Error details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchReviewDetails();
    }
  }, [reviewsUrls]);

  if (loading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="large" color="#2654d1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.header} 
        onPress={() => navigation?.navigate("ListPlace")} 
      >
        <Text style={styles.title}>Explorar</Text>
        <Ionicons name="chevron-forward-outline" size={25} color="#000000" />
      </Pressable>

      <View style={styles.grid}>
        {reviewsData.map((review, index) => (
          <View key={index} style={styles.card}>
            <Image 
              source={{ uri: `data:${review.mimeType};base64,${review.image}` }} 
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.footer}>
              <Text style={styles.place} numberOfLines={1}>{review.title}</Text>
              <Text style={styles.rating}>{review.valoration}/5</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: '4%',
  },
  title: {
    fontSize: 22, 
    fontWeight: "700",
    color: "#000",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: '4%',
  },
  card: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 120, 
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#2654d1",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  place: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
  },
  rating: {
    fontSize: 14,  
    fontWeight: "bold", 
    color: "#ffffff",
    marginLeft: 5,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Explore;