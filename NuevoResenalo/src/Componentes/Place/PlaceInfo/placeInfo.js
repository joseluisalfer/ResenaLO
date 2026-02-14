import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PlaceInfo = ({ name, description, averageRating }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{averageRating}</Text>
          <Ionicons name="star" size={18} color="#FFD700" /> 
        </View>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  description: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
});

export default PlaceInfo;