import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';

const VideoCallScreen = ({ route, navigation }) => {
  const { meetLink, eventId } = route.params;
  const [callMetrics, setCallMetrics] = useState(null);
  const [isCallEnded, setIsCallEnded] = useState(false);

  useEffect(() => {
    // Start tracking when component mounts
    const startTracking = async () => {
      try {
        await axios.post('/start-meeting-tracking', { eventId });
      } catch (error) {
        console.error('Tracking start error', error);
      }
    };

    startTracking();
  }, [eventId]);

  const handleEndCall = async () => {
    try {
      // Fetch meeting metrics when call ends
      const response = await axios.get(`/meeting-metrics/${eventId}`);
      setCallMetrics(response.data);
      setIsCallEnded(true);
    } catch (error) {
      console.error('Metrics fetch error', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {!isCallEnded ? (
        <>
          <WebView 
            source={{ uri: meetLink }}
            style={{ flex: 1 }}
          />
          <Button title="End Call" onPress={handleEndCall} />
        </>
      ) : (
        <View>
          <Text>Meeting Metrics</Text>
          <Text>Total Attendees: {callMetrics.totalAttendees}</Text>
          <Text>Duration: {callMetrics.duration} minutes</Text>
          <Button 
            title="Back to Meetings" 
            onPress={() => navigation.navigate('Meetings')} 
          />
        </View>
      )}
    </View>
  );
};

export default VideoCallScreen;