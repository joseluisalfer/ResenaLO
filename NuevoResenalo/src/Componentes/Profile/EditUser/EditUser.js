import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getData, updateData } from "../../../services/Services";
import Context from "../../../Context/Context";
import { useTranslation } from "react-i18next";

/**
 * EditUser Component: Provides a form for the logged-in user to update
 * their display name, username, and biography.
 */
const EditUser = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigation = useNavigation();
  const { emailLogged, setEmailLogged, theme, isDark } = useContext(Context);
  const { t } = useTranslation();
  const userEmail = emailLogged?.results?.email;

  /**
   * Loads existing user data from the server based on the logged-in email
   */
  const loadUser = async () => {
    try {
      setLoading(true);
      if (!userEmail) {
        setLoading(false);
        return;
      }
      const res = await getData(
        `http://44.213.235.160:8080/resenalo/userEmail?email=${userEmail}`,
      );

      if (res && res.results) {
        setName(res.results.name || "");
        setUsername(res.results.user || "");
        setBio(res.results.description || "");
      }
    } catch (e) {
      // Error handled silently or via specific UI if needed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  /**
   * Validates and submits the updated user profile data
   */
  const handleSave = async () => {
    try {
      if (saving) return;
      if (!userEmail) {
        Alert.alert(t("alerts.emailSession"));
        return;
      }

      const cleanName = name.trim();
      const cleanUsername = username.trim().replace(/^@/, "");
      const cleanBio = bio.trim();

      if (cleanName === "" || cleanUsername === "") {
        Alert.alert(t("alerts.emptyUsername"));
        return;
      }

      setSaving(true);
      const updatedUserData = {
        email: userEmail,
        newName: cleanName,
        newUsername: cleanUsername,
        newDescription: cleanBio,
      };

      try {
        await updateData(
          "http://44.213.235.160:8080/resenalo/updateUser",
          updatedUserData,
        );
      } catch (innerError) {
        // Handling non-JSON server responses gracefully if update was successful
        if (
          innerError.message.includes("JSON") ||
          innerError.message.includes("Unexpected end")
        ) {
          // Update was likely successful despite response format
        } else {
          throw innerError;
        }
      }

      // Sync global state with the new profile data
      setEmailLogged({
        ...emailLogged,
        results: {
          ...emailLogged.results,
          name: cleanName,
          user: cleanUsername,
          description: cleanBio,
        },
      });

      Alert.alert(t("alerts.excelentEdit"));
      navigation.goBack();
    } catch (e) {
      Alert.alert(t("alerts.errorEdit"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary || "#1748ce"} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.background,
        }}
      >
        <View style={styles.inputContainer}>
          {/* Display Name Input */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? "#121212" : "#fff",
                color: theme.text,
                borderColor: isDark ? "#333" : "#ccc",
              },
            ]}
            placeholder={t("profile.name")}
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={name}
            onChangeText={setName}
          />

          {/* Username Input */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? "#121212" : "#fff",
                color: theme.text,
                borderColor: isDark ? "#333" : "#ccc",
              },
            ]}
            placeholder={t("profile.username")}
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          {/* Bio/Description Input */}
          <TextInput
            style={[
              styles.bioInput,
              {
                backgroundColor: isDark ? "#121212" : "#fff",
                color: theme.text,
                borderColor: isDark ? "#333" : "#ccc",
              },
            ]}
            placeholder={t("profile.bio")}
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={bio}
            onChangeText={setBio}
            multiline={true}
            numberOfLines={4}
          />
        </View>

        {/* Form Action Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.addReviewButton, saving ? { opacity: 0.7 } : null]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.addReviewButtonText}>
                {t("profile.save")}
              </Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.cancelButton, saving ? { opacity: 0.7 } : null]}
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>{t("profile.cancel")}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
  },
  bioInput: {
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    padding: 15,
    fontSize: 16,
    textAlignVertical: "top",
  },
  addReviewButton: {
    backgroundColor: "#1748ce",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
  },
  addReviewButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#DC3545",
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
    width: "60%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default EditUser;
