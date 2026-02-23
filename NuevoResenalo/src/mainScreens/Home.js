import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import WeekPlace from "../../src/Componentes/Home/WeeksPlaces/weekPlaces";
import Friends from "../Componentes/Home/Friends/Friends";
import Explore from "../../src/Componentes/Home/Explore/Explore";
import Context from "../Context/Context";

const HomeScreen = ({ navigation }) => {  
  // Extraemos el theme del contexto
  const { theme } = useContext(Context);

  return (
    // Aplicamos el color de fondo dinámico al container
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 8,
  },
  top: { flex: 2, marginTop: '2%' },
  mid: { flex: 1 },
  bottom: { flex: 3 },
});