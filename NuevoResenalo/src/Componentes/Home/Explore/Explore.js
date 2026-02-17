import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Image, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../../../services/services";
import Context from "../../../Context/Context";

const Explore = ({ navigation }) => {
  const [reviewsUrls, setReviewsUrls] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setSearchUrl } = useContext(Context);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const data = await getData('http://44.213.235.160:8080/resenalo/randomReviews');
        if (data) setReviewsUrls(data);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUrls();
  }, []);

  useEffect(() => {
    if (reviewsUrls.length > 0) {
      const fetchReviewDetails = async () => {
        try {
          const reviews = await Promise.all(
            reviewsUrls.map(url => getData(url))
          );
          setReviewsData(reviews.filter(r => r !== null));
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchReviewDetails();
    }
  }, [reviewsUrls]);

  const handleOnPress = (url) => {
    setSearchUrl(url); 
    navigation.navigate("Place"); 
  };

  if (loading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="large" color="#2654d1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Pressable
        style={styles.header}
        onPress={() => navigation?.navigate("ListPlace")}
      >
        <Text style={styles.title}>Explorar</Text>
        <Ionicons name="chevron-forward-outline" size={25} color="#000000" />
      </Pressable>

      <View style={styles.grid}>
        {reviewsData.map((review, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.card,
              { opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => handleOnPress(reviewsUrls[index])}
          >
            <Image
              source={{ uri: `data:${review.mimeType};base64,${review.image}` }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.footer}>
              <Text style={styles.place} numberOfLines={1}>{review.title}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>{review.valoration}</Text>
                <Ionicons name="star" size={13} color="#FFD700" style={{ marginLeft: 3 }} />
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 5,
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
    paddingBottom: 20,
  },
  card: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#fff',
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  loadingWrapper: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Explore;