import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, Image, ActivityIndicator } from 'react-native';

const Explore = () => {
  const [reviewsUrls, setReviewsUrls] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://44.213.235.160:8080/resenalo/randomReviews')
      .then(response => response.json())
      .then(data => {
        setReviewsUrls(data);
      })
      .catch(error => {
        console.error("Error fetching reviews URLs:", error);
      });
  }, []);

  useEffect(() => {
    if (reviewsUrls.length > 0) {
      const fetchReviewDetails = async () => {
        const reviews = await Promise.all(
          reviewsUrls.map(async (url) => {
            const response = await fetch(url);
            const data = await response.json();
            return data;
          })
        );
        setReviewsData(reviews);
        setLoading(false);
      };

      fetchReviewDetails();
    }
  }, [reviewsUrls]);

  if (loading) {
    return (
      <View style={styles.wrapper}>
        <ActivityIndicator size="large" color="#2654d1" />
      </View>
    );
  }

  return (
      <View style={styles.grid}>
        {reviewsData.map((review, index) => (
          <View key={index} style={styles.card}>
            <Image 
              source={review.image} 
              style={styles.image}
            />
            <View style={styles.footer}>
              <View style={styles.infoWrapper}>
                <Text style={styles.rating}>{review.valoration} ⭐</Text>
                <Text style={styles.place}>{review.title}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  card: {
    width: "48%",
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#eee",
    aspectRatio: 1.2,
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: '60%',
    borderRadius: 12,
  },
  footer: {
    paddingHorizontal: '6%',
    paddingVertical: '5%',
    backgroundColor: "#2654d1",
    borderRadius: 12,
  },
  infoWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  place: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  rating: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 5,
  },
});

export default Explore;
