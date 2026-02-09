import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Podium from "../../../placeScreens/Podium";

const WeekPlace = ({ navigation }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.podiumRow}>
          <View style={styles.podiumItem}>
            <Text style={styles.rank}>2</Text>
            <View style={[styles.bar, styles.silver]} />
            <Text style={styles.place}>Murcia</Text>
          </View>

          <View style={styles.podiumItem}>
            <Text style={styles.rank}>1</Text>
            <View style={[styles.bar, styles.gold]} />
            <Text style={styles.place}>Sevilla</Text>
          </View>

          <View style={styles.podiumItem}>
            <Text style={styles.rank}>3</Text>
            <View style={[styles.bar, styles.bronze]} />
            <Text style={styles.place}>Alfafar</Text>
          </View>
        </View>

        <Pressable
          style={styles.titleWrapper}
          onPress={() => navigation.navigate("Podium")}
        >
          <Text style={styles.title}>Lugares de la Semana</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default WeekPlace;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: "#bfbfbf",
    borderRadius: 14,
    padding: "4%",
    justifyContent: "space-between",
  },
  podiumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: "2%",
  },
  podiumItem: {
    width: "30%",
    alignItems: "center",
  },
  rank: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    marginBottom: "4%",
  },
  bar: {
    width: "100%",
    borderRadius: 10,
  },
  gold: {
    height: "50%",
    backgroundColor: "#ffd549", 
  },
  silver: {
    height: "40%",
    backgroundColor: "#e7e7e7", 
  },
  bronze: {
    height: "30%",
    backgroundColor: "#d48332", 
  },
  place: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    marginTop: "4%",
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "4%", 
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  arrow: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 6,
  },
});
