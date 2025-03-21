import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { RTCView, mediaDevices } from "react-native-webrtc";
import io from "socket.io-client";
import Peer from "react-native-peerjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

// Server configuration
const SOCKET_SERVER = "http://10.0.2.2:3000";
const PEERJS_SERVER = {
  host: "10.0.2.2",
  port: 9000,
  path: "/peerjs",
  secure: false,
  debug: 3,
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:19302" },
      // If you have a TURN server, add it here
    ]
  }
};

const VC = ({ route, navigation }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [myPeerId, setMyPeerId] = useState("");
  const [callActive, setCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [targetPeerId, setTargetPeerId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isVideoAllowed, setIsVideoAllowed] = useState(false);
  const { type } = route.params;
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const callRef = useRef(null);
  const timerRef = useRef(null);

  const logDeviceRTCSupport = async () => {
    try {
      console.log("Checking WebRTC support...");
      const devices = await mediaDevices.enumerateDevices();
      console.log("Available devices:", devices);
      
      const hasVideoInput = devices.some(device => device.kind === 'videoinput');
      const hasAudioInput = devices.some(device => device.kind === 'audioinput');
      
      console.log(`Video input available: ${hasVideoInput}`);
      console.log(`Audio input available: ${hasAudioInput}`);
      
      if (!hasVideoInput || !hasAudioInput) {
        Alert.alert(
          "Limited Device Support",
          "Your device appears to have limited media capabilities. Video calling may not work properly in emulators."
        );
      }
    } catch (err) {
      console.error("Error checking media devices:", err);
    }
  };

  // Get meeting details from navigation params
  useEffect(() => {
    if (route.params?.meetingId) {
      // Fetch meeting details from API
      const id = route.params.meetingId;
      const fetchMeetingDetails = async () => {
        try {
          const response = await axios.get(
            `http://10.0.2.2:3000/meetings/get-meeting-by-id/${id}`
          );
          setMeetingInfo(response.data);
          
          // Check if video is allowed based on meeting type
          const meetingType = response.data.type || type;
          const videoAllowed = meetingType === "video call";
          setIsVideoAllowed(videoAllowed);
          
          // If it's voice-only, ensure camera is turned off
          if (!videoAllowed) {
            setIsCameraOff(true);
          }
          
          console.log(`Meeting type: ${meetingType}, Video allowed: ${videoAllowed}`);
        } catch (error) {
          console.error("Error fetching meeting details:", error);
          Alert.alert("Error", "Could not fetch meeting details");
        }
      };

      fetchMeetingDetails();
    } else {
      // Directly use the type passed in route.params
      const meetingType = type;
      const videoAllowed = meetingType === "video call";
      setIsVideoAllowed(videoAllowed);
      
      // If it's voice-only, ensure camera is turned off
      if (!videoAllowed) {
        setIsCameraOff(true);
      }
      
      console.log(`Meeting type from params: ${meetingType}, Video allowed: ${videoAllowed}`);
    }
  }, [route.params]);

  // Initialize connection and get user role
  useEffect(() => {
    logDeviceRTCSupport();
    const setupUser = async () => {
      try {
        // Get user role and email from storage
        const storedUserRole = await AsyncStorage.getItem("userRole");
        const email = await AsyncStorage.getItem("email");
        setUserRole(storedUserRole);

        // Generate unique peerId based on role and email
        const sanitizedEmail = email.replace(/[@.]/g, "_");
        const userId = `${storedUserRole}_${sanitizedEmail}`;
        await AsyncStorage.setItem("userIdVC", userId);

        // First connect socket.io and wait for connection confirmation
        console.log("Initializing socket connection...");
        socketRef.current = io(SOCKET_SERVER);
        
        // Wait for socket to connect before proceeding
        socketRef.current.on("connect", () => {
          console.log("Socket connected successfully");
          
          // Register user with the server
          socketRef.current.emit("register", { userId });
          console.log(`User registered with ID: ${userId}`);
          
          // Now initialize PeerJS after socket is ready
          console.log("Initializing PeerJS connection...");
          peerRef.current = new Peer(userId, PEERJS_SERVER);
          
          peerRef.current.on("open", (id) => {
            console.log(`PeerJS connection opened with ID: ${id}`);
            setMyPeerId(id);
            setIsConnecting(false);
            
            // Now socket is guaranteed to be connected
            socketRef.current.emit("peer-id-update", { userId, peerId: id });
            console.log(`Peer ID update sent to server: ${id}`);
          });
          
          // Error handling for peer connection
          peerRef.current.on("error", (err) => {
            console.error("Peer connection error:", err);
            Alert.alert("Connection Error", "Failed to establish peer connection. Please try again.");
          });
        });
        
        // Handle socket connection errors
        socketRef.current.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
          Alert.alert("Connection Error", "Failed to connect to the server. Please check your network and try again.");
          setIsConnecting(false);
        });
        
      } catch (error) {
        console.error("Setup error:", error);
        Alert.alert("Setup Error", "Failed to initialize video call setup");
        setIsConnecting(false);
      }
    };

    setupUser();

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Setup media devices based on meeting type
  useEffect(() => {
    const setupMediaDevices = async () => {
      try {
        // Set constraints based on whether video is allowed
        const constraints = {
          audio: true,
          video: isVideoAllowed ? {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          } : false
        };
        
        console.log(`Setting up media with constraints:`, constraints);
        const stream = await mediaDevices.getUserMedia(constraints);
        console.log("Media stream obtained successfully:", stream.getTracks().length, "tracks");
        
        // If this is a voice call, make sure video is disabled
        if (!isVideoAllowed) {
          const videoTracks = stream.getVideoTracks();
          videoTracks.forEach(track => {
            track.enabled = false;
            stream.removeTrack(track);
          });
          setIsCameraOff(true);
        }
        
        setLocalStream(stream);
      } catch (error) {
        console.error("Media device error:", error.message);
        Alert.alert("Error", `Cannot access ${isVideoAllowed ? "camera/" : ""}microphone: ${error.message}`);
      }
    };

    // Only setup media if we know whether video is allowed
    if (isVideoAllowed !== undefined) {
      setupMediaDevices();
    }
    
  }, [isVideoAllowed]);

  // Set up call handling after both peer connection and media are ready
  useEffect(() => {
    if (!peerRef.current || !localStream || !socketRef.current) return;

    // Handle incoming calls
    peerRef.current.on("call", (call) => {
      callRef.current = call;
      Alert.alert("Incoming Call", "Would you like to accept this call?", [
        {
          text: "Decline",
          onPress: () => call.close(),
          style: "cancel",
        },
        {
          text: "Accept",
          onPress: () => {
            // Ensure localStream is ready before answering
            if (!localStream) {
              Alert.alert("Error", "Microphone not ready");
              return;
            }
            call.answer(localStream);
            call.on("stream", (incomingStream) => {
              setRemoteStream(incomingStream);
              setCallActive(true);
              startCallTimer();
            });
            call.on("close", endCall);
            call.on("error", (err) => {
              console.error("Call error:", err);
              Alert.alert("Call Error", "Failed to connect to peer");
              endCall();
            });
          },
        },
      ]);
    });
    

    // Listen for call requests via socket
    socketRef.current.on("call-request", ({ from, meetingId }) => {
      setTargetPeerId(from);
      Alert.alert("Incoming Call", "Accept?", [
        {
          text: "Reject",
          onPress: () => socketRef.current.emit("call-rejected", { to: from }),
        },
        { text: "Accept", onPress: () => prepareForCall(from, meetingId) },
      ]);
    });

    // Handle call ended notification
    socketRef.current.on("call-ended", () => {
      endCall();
    });

    // Handle call rejection
    socketRef.current.on("call-rejected", () => {
      setIsConnecting(false);
      Alert.alert("Call Rejected", "The other person declined your call.");
    });

  }, [peerRef.current, localStream, socketRef.current]);

  // Start call timer to track call duration
  const startCallTimer = () => {
    setCallTimer(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCallTimer(prev => prev + 1);
    }, 1000);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Prepare for incoming call
  const prepareForCall = (peerId, meetingId) => {
    console.log(`Preparing for call from ${peerId} for meeting ${meetingId}`);
    if (!localStream) {
      Alert.alert("Error", "Microphone not ready");
      return;
    }
    setTargetPeerId(peerId);
    
    // If an incoming call is present, answer that call
    if (callRef.current) {
      answerCall();
    } else {
      // Otherwise, initiate a connection if appropriate
      initiateConnection(peerId);
    }
  };
  
  // Initiate a connection to a peer
  const initiateConnection = (peerId) => {
    if (!localStream) {
      Alert.alert("Error", "Microphone not ready");
      return;
    }
    
    try {
      console.log(`Calling peer: ${peerId} with ${localStream.getTracks().length} tracks`);
      const call = peerRef.current.call(peerId, localStream);
      callRef.current = call;
      
      call.on("stream", (stream) => {
        console.log("Remote stream received with", stream.getTracks().length, "tracks");
        setRemoteStream(stream);
        setCallActive(true);
        startCallTimer();
      });
      
      // Add a timeout to detect if the call isn't connecting
      setTimeout(() => {
        if (!remoteStream && callRef.current === call) {
          console.warn("Call connection timeout");
          Alert.alert("Connection Issue", "Unable to establish media connection. Try again on a physical device.");
        }
      }, 10000);
      
      call.on("close", () => {
        console.log("Call closed");
        endCall();
      });
      
      call.on("error", (err) => {
        console.error("Call error:", err);
        Alert.alert("Call Error", `Failed to connect: ${err.message}`);
        endCall();
      });
    } catch (error) {
      console.error("Connection error:", error);
      Alert.alert("Error", `Failed to establish connection: ${error.message}`);
    }
  };

  // Initiate a call to the other party
  const startCall = async () => {
    if (!meetingInfo) {
      Alert.alert("Error", "Meeting information not available");
      return;
    }
    
    if (!localStream) {
      Alert.alert("Error", "Microphone not ready");
      return;
    }
  
    setIsConnecting(true);
    
    const targetRole = userRole === "expert" ? "user" : "expert";
    const targetEmail = userRole === "expert" ? meetingInfo.userEmail : meetingInfo.expertemail;
    const sanitizedTargetEmail = targetEmail.replace(/[@.]/g, "_");
    const targetId = `${targetRole}_${sanitizedTargetEmail}`;
    
    console.log(`Attempting to call: ${targetId}`);
    setTargetPeerId(targetId);
  
    try {
      const response = await axios.get(`http://10.0.2.2:3000/videocall/check-user/${targetId}`);
      if (!response.data.online || !response.data.peerId) {
        setIsConnecting(false);
        Alert.alert("Error", "User is offline or unavailable");
        return;
      }
  
      console.warn(`Emitting call request to ${targetId}`);
      socketRef.current.emit("call-request", { to: targetId, from: myPeerId, meetingId: meetingInfo._id });
      initiateConnection(targetId);
      
      setTimeout(() => {
        if (!remoteStream && !callActive) {
          setIsConnecting(false);
          Alert.alert("Connection Timeout", "Could not establish connection with the other party.");
          endCall();
        }
      }, 30000);
    } catch (error) {
      console.error("Error checking user status:", error);
      setIsConnecting(false);
      Alert.alert("Error", "Could not verify user availability");
    }
  };
  

  // Answer an incoming call
  const answerCall = () => {
    if (!localStream) {
      Alert.alert("Error", "Microphone not ready");
      return;
    }
    
    if (callRef.current) {
      callRef.current.answer(localStream);
      
      callRef.current.on("stream", (stream) => {
        console.log("Received remote stream in answerCall");
        setRemoteStream(stream);
        setCallActive(true);
        startCallTimer();
      });
      
      callRef.current.on("close", () => {
        console.log("Call closed in answerCall");
        endCall();
      });
    } else {
      console.error("No active call reference to answer");
      Alert.alert("Error", "Call connection issue. Please try again.");
    }
  };

  // End the current call
  const endCall = () => {
    if (callRef.current) {
      callRef.current.close();
      callRef.current = null;
    }
    
    if (socketRef.current && targetPeerId) {
      socketRef.current.emit("call-ended", { to: targetPeerId });
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setRemoteStream(null);
    setCallActive(false);
    setCallTimer(0);
    setIsConnecting(false);
  };

  // Toggle mute state
  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Toggle camera state - only available in video calls
  const toggleCamera = () => {
    if (!isVideoAllowed) {
      Alert.alert("Not Available", "Video is not available in voice-only calls");
      return;
    }
    
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  // Show loading indicator while connecting
  if (isConnecting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Connecting...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {callActive 
            ? "Call in progress" 
            : `Ready for ${isVideoAllowed ? "video" : "voice"} call`}
        </Text>
        {callActive && <Text style={styles.timerText}>{formatTime(callTimer)}</Text>}
      </View>

      <View style={styles.videoContainer}>
        {/* Remote video (full screen) - only shown if video is allowed and available */}
        {remoteStream && isVideoAllowed && remoteStream.getVideoTracks().length > 0 ? (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteVideo}
            objectFit="cover"
          />
        ) : (
          <View style={styles.noVideoContainer}>
            <Text style={styles.noVideoText}>
              {!callActive 
                ? "Waiting for other participant..." 
                : isVideoAllowed 
                  ? "Video not available from other participant" 
                  : "Voice Call Only"}
            </Text>
          </View>
        )}

        {/* Local video (picture-in-picture) - only shown if video is allowed */}
        {localStream && isVideoAllowed && !isCameraOff && (
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localVideo}
            objectFit="cover"
            zOrder={1}
          />
        )}
      </View>

      <View style={styles.controlsContainer}>
        {!callActive ? (
          <TouchableOpacity
            style={styles.callButton}
            onPress={startCall}
            disabled={isConnecting}
          >
            <Text style={styles.buttonText}>Start {isVideoAllowed ? "Video" : "Voice"} Call</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.activeCallControls}>
            <TouchableOpacity 
              style={[styles.controlButton, isMuted && styles.activeControlButton]} 
              onPress={toggleMute}
            >
              <Text style={styles.buttonText}>{isMuted ? "Unmute" : "Mute"}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, styles.endCallButton]} 
              onPress={endCall}
            >
              <Text style={styles.buttonText}>End Call</Text>
            </TouchableOpacity>
            
            {/* Only show video toggle button if video is allowed */}
            {isVideoAllowed && (
              <TouchableOpacity 
                style={[styles.controlButton, isCameraOff && styles.activeControlButton]} 
                onPress={toggleCamera}
              >
                <Text style={styles.buttonText}>{isCameraOff ? "Start Video" : "Stop Video"}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

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
  remoteVideo: {
    flex: 1,
    backgroundColor: "#2c2c2c",
  },
  localVideo: {
    width: 120,
    height: 160,
    backgroundColor: "#4c4c4c",
    position: "absolute",
    top: 20,
    right: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
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

export default VC;