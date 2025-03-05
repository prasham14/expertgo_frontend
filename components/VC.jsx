// import React, { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
// import RtcEngine, { RtcLocalView, RtcRemoteView, ChannelProfile } from "react-native-agora";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// // Agora Config
// const APP_ID = "1207080388";  // Replace with your Agora App ID
// const CHANNEL_NAME = "test_channel"; // Unique channel name for the call
// const TOKEN = null; // Set this if you enabled token authentication

// const AgoraVideoCall = ({ route, navigation }) => {
//   const [engine, setEngine] = useState(null);
//   const [joined, setJoined] = useState(false);
//   const [peerIds, setPeerIds] = useState([]);
//   const [timer, setTimer] = useState(0);

//   useEffect(() => {
//     async function init() {
//       const rtcEngine = await RtcEngine.create(APP_ID);
//       await rtcEngine.enableVideo();
//       await rtcEngine.setChannelProfile(ChannelProfile.Communication);
      
//       rtcEngine.addListener("UserJoined", (uid) => {
//         setPeerIds((prev) => [...prev, uid]);
//       });

//       rtcEngine.addListener("UserOffline", (uid) => {
//         setPeerIds((prev) => prev.filter((id) => id !== uid));
//       });

//       rtcEngine.addListener("JoinChannelSuccess", () => {
//         setJoined(true);
//         startCallTimer();
//       });

//       setEngine(rtcEngine);
//     }

//     init();

//     return () => {
//       if (engine) {
//         engine.destroy();
//       }
//     };
//   }, []);

//   const startCallTimer = async () => {
//     const amount = await AsyncStorage.getItem("meetingAmount");
//     const callDuration = parseInt(amount) / 10; // Example: ₹100 → 10 minutes

//     setTimer(callDuration * 60);
    
//     let interval = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           endCall();
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   const joinChannel = async () => {
//     if (engine) {
//       await engine.joinChannel(TOKEN, CHANNEL_NAME, null, 0);
//     }
//   };

//   const endCall = async () => {
//     if (engine) {
//       await engine.leaveChannel();
//       setJoined(false);
//       navigation.goBack();
//       Alert.alert("Call Ended", "Your call time is over!");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {joined ? (
//         <View style={styles.videoContainer}>
//           <RtcLocalView.SurfaceView style={styles.localVideo} />
//           {peerIds.length > 0 && <RtcRemoteView.SurfaceView uid={peerIds[0]} style={styles.remoteVideo} />}
//           <Text style={styles.timerText}>Time Left: {Math.floor(timer / 60)}:{timer % 60}</Text>
//         </View>
//       ) : (
//         <TouchableOpacity style={styles.button} onPress={joinChannel}>
//           <Text style={styles.buttonText}>Start Video Call</Text>
//         </TouchableOpacity>
//       )}
//       {joined && (
//         <TouchableOpacity style={styles.endButton} onPress={endCall}>
//           <Text style={styles.buttonText}>End Call</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
//   videoContainer: { flex: 1, width: "100%", alignItems: "center" },
//   localVideo: { width: "100%", height: "50%" },
//   remoteVideo: { width: "100%", height: "50%", position: "absolute", top: 0 },
//   timerText: { fontSize: 20, fontWeight: "bold", color: "red", marginTop: 10 },
//   button: { padding: 15, backgroundColor: "#007AFF", borderRadius: 10 },
//   endButton: { marginTop: 20, padding: 15, backgroundColor: "red", borderRadius: 10 },
//   buttonText: { color: "#fff", fontSize: 16 },
// });

// export default AgoraVideoCall;
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const VC = () => {
  return (
    <View>
      <Text>VC</Text>
    </View>
  )
}

export default VC

const styles = StyleSheet.create({})