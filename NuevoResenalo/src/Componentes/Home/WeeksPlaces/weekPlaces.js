import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Podium from "../../../placeScreens/Podium";
import { Ionicons } from "@expo/vector-icons"; // Importando Ionicons
import { getData } from "../../../services/services";
import { useTranslation } from 'react-i18next'
import '../../../../assets/i18n/index';
const WeekPlace = ({ navigation }) => {

  const { t } = useTranslation();

  const [top3, setTop3] = useState([]);

  const obtainData = async () => {
    const response = await fetch("http://44.213.235.160:8080/resenalo/top3Reviews");
    const data = await response.json();

    console.log("Enlaces recibidos:", data);

    const details = await Promise.all(
      data.map(async (data) => {
        const res = await fetch(data);
        const detailsData = await res.json();
        console.log("Detalles recibidos para el enlace:", detailsData)
        return detailsData;
      })
    );

    setTop3(details);
  }

  useEffect(() => {
    obtainData();
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.podiumRow}>

          {top3.map((place, index) => {
            const rank = index + 1;  // Para determinar el rango (1, 2, 3)
            let barStyle = styles.bronze;

            // Cambiar el estilo según el rank
            if (rank === 1) barStyle = styles.gold;
            else if (rank === 2) barStyle = styles.silver;

            return (
              <View key={rank} style={styles.podiumItem}>
                <Text style={styles.rank}>{rank}</Text>
                <View style={[styles.bar, barStyle]} />
                <Text style={styles.place}>{place.title}</Text> {/* Muestra el título del lugar */}
              </View>
            );
          })}
        </View>

        <Pressable
          style={styles.titleWrapper}
          onPress={() => navigation.navigate("Podium")}
        >
          <Text style={styles.title}>{t("home.places_week")}</Text>
          <Ionicons name="chevron-forward-outline" size={25} color="#fff" />
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
    backgroundColor: "#2654d1",
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
