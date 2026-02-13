import React from "react";
import { View, Text, Keyboard, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import "../../../../assets/i18n/index";
const FormInput = ({ label, placeholder }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      mode="outlined"
      placeholder={placeholder}
      style={styles.input}
      onSubmitEditing={Keyboard.dismiss}
      dense
    />
  </View>
);

const DatosPublish = () => {
  const { t } = useTranslation();

  return (
    <View>
      <FormInput
        label={t("publishScreen.name")}
        placeholder={t("publishScreen.new_place")}
      />
      <Text>{t("publishScreen.location")}</Text>
      <FormInput
        label={"LATITUD"}
        placeholder={t("publishScreen.new_location")}
      />
      <FormInput
        label={"LONGITUD"}
        placeholder={t("publishScreen.new_location")}
      />

      <FormInput
        label={t("publishScreen.type")}
        placeholder={t("publishScreen.new_type")}
      />
      <FormInput
        label={t("publishScreen.description")}
        placeholder={t("publishScreen.new_description")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    width: 120,
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "transparent",
  },
});

export default DatosPublish;
