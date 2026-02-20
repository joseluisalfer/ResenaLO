import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import WeekPlace from "../../src/Componentes/Home/WeeksPlaces/weekPlaces";
import Friends from "../Componentes/Home/Friends/friends";
import Explore from "../../src/Componentes/Home/Explore/Explore";
import Context from "../Context/Context";

const HomeScreen = ({ navigation }) => {  
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <WeekPlace navigation={navigation} />
      </View>

      <View style={styles.mid}>
        
        <Friends navigation={navigation} />
      </View>

      <View style={styles.bottom}>
        <Explore navigation={navigation} />
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
  top: { flex: 2, marginTop: '2%' },
  mid: { flex: 1 },
  bottom: { flex: 3 },
});