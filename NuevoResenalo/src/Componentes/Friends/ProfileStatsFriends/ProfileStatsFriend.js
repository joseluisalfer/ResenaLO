import React, { useState, useEffect} from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";

const ProfileStatsFriend = () => {
const [user, setUser] = useState({});
 useEffect(() => {

    obtainData();
  }, []);

const obtainData = async () => {
      
        const data = await getData(
          "http://44.213.235.160:8080/first/userEmail?email=oscarmartorellg@gmail.com"
        );
        setUser(data.results);
        
     
    };

  return (
    <Card style={styles.statsCard}>
      <Card.Content style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text variant="titleMedium" style={styles.statText}>24</Text>
          <Text variant="bodySmall" style={styles.statText}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="titleMedium" style={styles.statText}>100{user.friends}</Text>
          <Text variant="bodySmall" style={styles.statText}>Friends</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 16,
    width: "90%",
    backgroundColor: "#2654d1",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statText: {
    color: "white",
    fontSize: 18,
    
  }
});

export default ProfileStatsFriend;
