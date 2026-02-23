import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PlaceInfo = ({ name, description, type, averageRating }) => {
  const formattedRating = typeof averageRating === 'number' ? averageRating.toFixed(1) : averageRating;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{formattedRating}</Text>
          <Ionicons name="star" size={16} color="#000000" />
        </View>
      </View>

      <Text style={styles.type}>{type}</Text>
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
    justifyContent: 'flex-start', 
    alignItems: 'center',
    flexWrap: 'wrap', 
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10, 
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
  type: { 
    fontSize: 14, 
    color: '#1748ce', 
    fontWeight: '600', 
    textTransform: 'uppercase', 
    marginTop: 4 
  },
  description: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
});

export default PlaceInfo;