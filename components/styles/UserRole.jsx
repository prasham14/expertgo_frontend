
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff", // Clean white background
      padding: 20,
      paddingTop: 80, // Space for the header
      alignItems: "center",
    },
    header: {
      position: "absolute",
      top: 20,
      left: 20,
      right: 20,
      alignItems: "center",
    },
    logo: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#000",
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: "#000",
      textAlign: "center",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: "#555",
      textAlign: "center",
      marginBottom: 30,
    },
    optionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 30,
    },
    optionButton: {
      flex: 1,
      paddingVertical: 15,
      marginHorizontal: 5,
      borderWidth: 2,
      borderColor: "#000",
      borderRadius: 10,
      alignItems: "center",
    },
    optionButtonSelected: {
      backgroundColor: "#000",
    },
    optionText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#000",
    },
    optionTextSelected: {
      color: "#fff",
    },
    submitButton: {
      backgroundColor: "#000",
      paddingVertical: 15,
      borderRadius: 25,
      width: "90%",
      alignItems: "center",
      marginTop: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
    },
    submitButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
    },
  });

  export default styles;