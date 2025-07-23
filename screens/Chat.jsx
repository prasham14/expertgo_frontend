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
import styles from '../components/styles/Chat';

const ChatScreen = ({ route, navigation }) => {
   const { conversationId,recipientEmail } = route.params;

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [recipientTyping, setRecipientTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = await AsyncStorage.getItem('email');
        if (!email) {
          console.error('No email found in AsyncStorage');
          setLoading(false);
          return;
        }
        
        setUserEmail(email);
        
        // Initialize socket connection
        const socketInstance = io('https://expertgo-v1.onrender.com');
        
        socketInstance.on('connect', () => {
          console.log('Socket connected in chat screen');
          socketInstance.emit('register', { userId: email });
        });
        
        setSocket(socketInstance);
        
        // Fetch previous messages
        const response = await axios.get(`https://expertgo-v1.onrender.com/chat/get-messages/${conversationId}`);
        
        if (response.data.success) {
          setMessages(response.data.messages);
          
          // Mark received messages as read
          const unreadMessageIds = response.data.messages
            .filter(msg => msg.sender === recipientEmail && !msg.read)
            .map(msg => msg._id);
          
          if (unreadMessageIds.length > 0) {
            markMessagesAsRead(unreadMessageIds);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId]);

  // Listen for new messages and typing status
  useEffect(() => {
    if (!socket) return;
    
    socket.on('new-message', (newMessage) => {
      if ((newMessage.sender === recipientEmail && newMessage.receiver === userEmail) ||
          (newMessage.sender === userEmail && newMessage.receiver === recipientEmail)) {
        setMessages(prevMessages => [...prevMessages, newMessage]);
        
        // Mark received messages as read
        if (newMessage.sender === recipientEmail) {
          markMessagesAsRead([newMessage._id]);
        }
      }
    });
    
    socket.on('typing-status', (status) => {
      if (status.sender === recipientEmail) {
        setRecipientTyping(status.isTyping);
      }
    });
    
    socket.on('message-read', ({ messageIds }) => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          messageIds.includes(msg._id) ? { ...msg, read: true } : msg
        )
      );
    });
    
    return () => {
      socket.off('new-message');
      socket.off('typing-status');
      socket.off('message-read');
    };
  }, [socket, recipientEmail, userEmail]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleTyping = () => {
    if (!isTyping && socket) {
      setIsTyping(true);
      socket.emit('typing', { 
        sender: userEmail, 
        receiver: recipientEmail, 
        isTyping: true 
      });
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (socket) {
        socket.emit('typing', { 
          sender: userEmail, 
          receiver: recipientEmail, 
          isTyping: false 
        });
      }
    }, 2000);
  };

  const markMessagesAsRead = async (messageIds) => {
    try {
      await axios.post('https://expertgo-v1.onrender.com/chat/mark-read', { messageIds });
      
      // Notify the sender that messages were read
      if (socket) {
        socket.emit('mark-read', { 
          sender: recipientEmail, 
          messageIds 
        });
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !userEmail || !socket) return;
    
    try {
      const messageData = {
        meetingId: conversationId, // Now using conversationId instead of meetingId
        sender: userEmail,
        receiver: recipientEmail,
        text: messageText,
        timestamp: new Date().toISOString()
      };
      
      // Clear input first for better UX
      setMessageText('');
      
      // Send message to server
      const response = await axios.post('https://expertgo-v1.onrender.com/chat/send', messageData);
      
      if (response.data.success) {
        // Add server-generated message ID
        const savedMessage = {
          ...messageData,
          _id: response.data.messageId
        };
        
        // Add to local state
        setMessages(prevMessages => [...prevMessages, savedMessage]);
        
        // Emit event to socket for real-time updates
        socket.emit('send-message', savedMessage);
      }
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
        <View style={styles.messageFooter}>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isUserMessage && (
            <Text style={styles.readStatus}>
              {item.read ? '✓✓' : '✓'}
            </Text>
          )}
        </View>
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{recipientEmail}</Text>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id || `temp-${item.timestamp}`}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      {recipientTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>{recipientEmail} is typing...</Text>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={(text) => {
            setMessageText(text);
            handleTyping();
          }}
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
