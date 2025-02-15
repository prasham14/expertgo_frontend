import React from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar } from "react-native";

const TandC = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Text style={styles.header}>Terms & Conditions</Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          Welcome to Expertgo! By using our app, you agree to the following terms and conditions.
          Please read them carefully.
        </Text>

        <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
        <Text style={styles.text}>
          You must use this app responsibly and comply with all applicable laws. Any misuse of the 
          platform, including fraudulent activities, is strictly prohibited.
        </Text>

        <Text style={styles.sectionTitle}>3. Account Security</Text>
        <Text style={styles.text}>
          Users are responsible for maintaining the security of their accounts. Do not share 
          your password with anyone.
        </Text>

        <Text style={styles.sectionTitle}>4. Content Ownership</Text>
        <Text style={styles.text}>
          All content provided on this platform is either owned by us or licensed for use. 
          Unauthorized copying, distribution, or modification is not allowed.
        </Text>

        <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
        <Text style={styles.text}>
          We are not responsible for any direct or indirect damages resulting from the use of this app.
        </Text>

        <Text style={styles.sectionTitle}>6. Changes to Terms</Text>
        <Text style={styles.text}>
          We reserve the right to modify these terms at any time. Continued use of the app means 
          acceptance of the updated terms.
        </Text>

        <Text style={styles.footerText}>
          If you have any questions, contact us at support@expertgo.com
        </Text>
      </ScrollView>
    </View>
  );
};

export default TandC;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: "#007bff",
  },
  text: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  footerText: {
    fontSize: 14,
    color: "#777",
    marginTop: 20,
    textAlign: "center",
  },
});
