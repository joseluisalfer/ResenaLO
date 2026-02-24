import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import WeekPlace from "../../src/Componentes/Home/WeeksPlaces/weekPlaces";
import Friends from "../Componentes/Home/Friends/Friends";
import Explore from "../../src/Componentes/Home/Explore/Explore";
import Context from "../Context/Context";

/**
 * HomeScreen: The main dashboard of the application.
 * Divided into three proportional sections:
 * 1. Weekly Highlights (Top)
 * 2. Social/Friends Feed (Middle)
 * 3. Exploration/General Discovery (Bottom)
 */
const HomeScreen = ({ navigation }) => {
  // Access global theme to ensure dark/light mode consistency
  const { theme } = useContext(Context);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Section: Featured or trending places of the week */}
      <View style={styles.top}>
        <WeekPlace navigation={navigation} />
      </View>

      {/* Middle Section: Social updates and friend activity */}
      <View style={styles.mid}>
        <Friends navigation={navigation} />
      </View>

      {/* Bottom Section: Broad discovery and exploration tools */}
      <View style={styles.bottom}>
        <Explore navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 8,
  },
  // flex ratios define how much vertical space each section occupies
  top: {
    flex: 2,
    marginTop: "2%",
  },
  mid: {
    flex: 1,
  },
  bottom: {
    flex: 3,
  },
});

export default HomeScreen;
