import React from "react";
import { View, StyleSheet } from "react-native";
import WeekPlace from "../../src/Componentes/Home/WeeksPlaces/weekPlaces";
import Friends from "../../src/Componentes/Home/Friends/friends";
import Explore from "../../src/Componentes/Home/Explore/Explore";

const HomeScreen = ({ navigation }) => {
  const friends = [
    { id: "1", name: "PeterNFS" },
    { id: "2", name: "ChentePro" },
    { id: "3", name: "Licenia" },
    { id: "4", name: "Miguel" },
    { id: "5", name: "David" },
  ];


  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <WeekPlace navigation={navigation} />
      </View>

      <View style={styles.mid}>
        <Friends navigation={navigation} friends={friends} />
      </View>

      <View style={styles.bottom}>
        <Explore navigation={navigation}  />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 8,
  },
  top: {
    flex: 2, 
    marginBottom: 10,
  },
  mid: {
    flex: 1.2, 
    marginBottom: 5, 
  },
  bottom: {
    flex: 3, 
  },
});
