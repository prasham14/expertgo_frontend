import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#1a1a1a",
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    headerText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
    timerText: {
      color: "white",
      fontSize: 16,
    },
    videoContainer: {
      flex: 1,
      position: "relative",
    },
    participantContainer: {
      flex: 1,
      position: "relative",
    },
    remoteVideo: {
      flex: 1,
      backgroundColor: "#2c2c2c",
    },
    localVideoContainer: {
      position: "absolute",
      top: 20,
      right: 20,
      width: 120,
      height: 160,
      borderRadius: 8,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "white",
    },
    localVideo: {
      flex: 1,
      backgroundColor: "#4c4c4c",
    },
    noVideoContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#2c2c2c",
    },
    noVideoText: {
      color: "white",
      fontSize: 16,
      textAlign: "center",
      padding: 20,
    },
    participantInfo: {
      position: "absolute",
      bottom: 10,
      left: 10,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: 5,
      borderRadius: 5,
    },
    participantName: {
      color: "white",
      fontSize: 14,
      marginRight: 5,
    },
    mutedText: {
      color: "white",
      fontSize: 14,
    },
    controlsContainer: {
      padding: 20,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    callButton: {
      backgroundColor: "#4CAF50",
      padding: 15,
      borderRadius: 30,
      alignItems: "center",
    },
    activeCallControls: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    controlButton: {
      backgroundColor: "#555555",
      padding: 15,
      borderRadius: 30,
      minWidth: 80,
      alignItems: "center",
    },
    activeControlButton: {
      backgroundColor: "#e67e22",
    },
    endCallButton: {
      backgroundColor: "#f44336",
    },
    buttonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "bold",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#1a1a1a",
    },
    loadingText: {
      color: "white",
      marginTop: 20,
      fontSize: 18,
    },
  });


  export default styles