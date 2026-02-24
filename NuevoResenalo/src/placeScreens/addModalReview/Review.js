import React, { useState, useContext } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { postData } from "../../services/Services";
import Context from "../../Context/Context";
import { useTranslation } from "react-i18next";

/**
 * Review Component: A modal-style screen that allows users to submit
 * a star rating and a text comment for a specific location.
 */
function Review({ route, navigation }) {
  const { reviewId } = route.params || {};

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const { emailLogged, theme, isDark } = useContext(Context);
  const { t } = useTranslation();

  /**
   * Handles the API submission of the review data.
   */
  const handleSubmitReview = async () => {
    // Validation logic
    if (rating === 0) {
      Alert.alert(t("alerts.error"), t("alerts.selectRating"));
      return;
    }
    if (!reviewText.trim()) {
      Alert.alert(t("alerts.error"), t("alerts.emptyComment"));
      return;
    }
    if (!reviewId) {
      Alert.alert(t("alerts.error"), t("alerts.missingId"));
      return;
    }

    setLoading(true);

    const data = {
      reviewId: reviewId,
      user: emailLogged.results.user,
      text: reviewText.trim(),
      valoration: rating.toString(),
    };

    try {
      const response = await postData(
        "http://44.213.235.160:8080/resenalo/commentReview",
        data,
      );

      // Successfully posted
      if (response === null || response) {
        Alert.alert(t("alerts.success"), t("alerts.reviewPosted"), [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(t("alerts.error"), t("alerts.serverError"));
      }
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert(t("alerts.error"), t("alerts.connectionError"));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renders a 5-star interactive component.
   */
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((i) => (
      <Pressable key={i} onPress={() => setRating(i)}>
        <Ionicons
          name={i <= rating ? "star" : "star-outline"}
          size={45}
          color={i <= rating ? "#FFD700" : isDark ? "#444" : "#BDC3C7"}
          style={{ marginHorizontal: 5 }}
        />
      </Pressable>
    ));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.layout, { backgroundColor: theme.background }]}>
        {/* Review Card Container */}
        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]}>
            {t("modalReview.header")}
          </Text>

          {/* Star Selection Row */}
          <View style={styles.starContainer}>{renderStars()}</View>

          {/* Text Feedback Input */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? "#121212" : "#f9f9f9",
                borderColor: isDark ? "#333" : "#eee",
                color: theme.text,
              },
            ]}
            multiline
            numberOfLines={5}
            placeholder={t("modalReview.inputHolder")}
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={reviewText}
            onChangeText={setReviewText}
          />

          {/* Submit Action */}
          <Pressable
            style={[
              styles.submitButton,
              loading &&
                (isDark ? styles.buttonDisabledDark : styles.buttonDisabled),
            ]}
            onPress={handleSubmitReview}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {t("modalReview.buttonAdd")}
              </Text>
            )}
          </Pressable>

          {/* Secondary Action: Close Modal */}
          <Pressable
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text
              style={[
                styles.cancelText,
                { color: isDark ? "#ff5c5c" : "#DC3545" },
              ]}
            >
              {t("modalReview.buttonCancel")}
            </Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    height: 120,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#2654d1",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#a5b4e0",
  },
  buttonDisabledDark: {
    backgroundColor: "#1a3582",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 15,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default Review;
