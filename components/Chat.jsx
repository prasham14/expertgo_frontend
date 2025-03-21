import React, { useState, useEffect, useRef } from 'react';
import { 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import io from 'socket.io-client';
import styles from './styles/Chat';
const ChatScreen = ({ route, navigation }) => {
  const { recipientEmail, meetingId } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First, test if AsyncStorage is working correctly
        const email = await AsyncStorage.getItem('email');
        if (!email) {
          console.error('No email found in AsyncStorage');
          setLoading(false);
          return;
        }
        console.warn('Retrieved email:', email); // Debug log
        
        const role = await AsyncStorage.getItem('userRole');
        console.warn('Retrieved role:', role); // Debug log
        
        setUserEmail(email);
        setUserRole(role);
        
        // Log before socket connection
        console.warn('Attempting to connect to socket server...');
        
        // Initialize socket connection
        const socketInstance = io('http://10.0.2.2:3000');
        
        // Add connection event handlers to debug socket issues
        socketInstance.on('connect', () => {
          console.warn('Socket connected!', socketInstance.id);
        });
        
        socketInstance.on('connect_error', (err) => {
          console.error('Socket connection error:', err.message);
        });
        
        setSocket(socketInstance);
        
        // Log before API call
        console.warn('Fetching messages for meeting:', meetingId);
        
        // Fetch previous messages
        const response = await axios.get(`http://10.0.2.2:3000/chat/get-messages/${meetingId}`);
        console.warn('API response:', response.data); // Debug log
        
        if (response.data.success) {
          setMessages(response.data.messages);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error.message);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        setLoading(false);
      }
    };
    
    fetchUserData();
    
    // Cleanup function to disconnect socket
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [meetingId]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;
    
    socket.on('new-message', (newMessage) => {
      if (newMessage.meetingId === meetingId) {
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
    });
    
    return () => {
      socket.off('new-message');
    };
  }, [socket, meetingId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!messageText.trim() || !userEmail || !socket) return;
    
    try {
      const messageData = {
        meetingId,
        sender: userEmail,
        receiver: recipientEmail,
        text: messageText,
        timestamp: new Date().toISOString()
      };
      
      // Send message to server
      await axios.post('http://10.0.2.2:3000/chat/send', messageData);
      
      // Emit event to socket
      socket.emit('send-message', messageData);
      
      // Clear input
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => {
    const isUserMessage = item.sender === userEmail;
    
    return (
      <View style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessage : styles.otherMessage
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat with {recipientEmail}</Text>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => `msg-${index}-${item.timestamp}`}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !messageText.trim() && styles.disabledButton]}
          onPress={sendMessage}
          disabled={!messageText.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
export default ChatScreen;