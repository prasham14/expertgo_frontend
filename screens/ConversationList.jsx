import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import io from 'socket.io-client';

const ConversationsListScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const setupUser = async () => {
      try {
        const email = await AsyncStorage.getItem('email');
        if (!email) {
          console.error('No email found in AsyncStorage');
          return;
        }
        
        setUserEmail(email);
        
        // Connect to socket
        const socketInstance = io('http://10.0.2.2:3000');
        socketInstance.on('connect', () => {
          console.log('Socket connected in conversations list');
          socketInstance.emit('register', { userId: email });
        });
        
        setSocket(socketInstance);
        
        // Fetch conversations
        fetchConversations(email);
      } catch (error) {
        console.error('Error setting up user:', error);
      }
    };
    
    setupUser();
    
    // Cleanup
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);
  
  useEffect(() => {
    if (!socket) return;
    
    // Listen for new messages to update conversation list
    socket.on('new-message', (messageData) => {
      updateConversationWithMessage(messageData);
    });
    
    return () => {
      socket.off('new-message');
    };
  }, [socket, conversations]);
  
  const fetchConversations = async (email) => {
    try {
      const response = await axios.get(`http://10.0.2.2:3000/convo/user/${email}`);
      if (response.data.success) {
        setConversations(response.data.conversations);
      }
      console.log(response.data.conversations)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };
  
  const updateConversationWithMessage = (messageData) => {
    setConversations(prevConversations => {
      const updatedConversations = [...prevConversations];
      const conversationIndex = updatedConversations.findIndex(
        conv => conv.participants.includes(messageData.sender) && 
               conv.participants.includes(messageData.receiver)
      );
      
      if (conversationIndex !== -1) {
        // Update existing conversation
        updatedConversations[conversationIndex] = {
          ...updatedConversations[conversationIndex],
          lastMessage: {
            text: messageData.text,
            sender: messageData.sender,
            timestamp: messageData.timestamp
          }
        };
      } else {
        // Create new conversation entry if doesn't exist
        updatedConversations.push({
          participants: [messageData.sender, messageData.receiver],
          lastMessage: {
            text: messageData.text,
            sender: messageData.sender,
            timestamp: messageData.timestamp
          },
          _id: `temp-${Date.now()}`
        });
      }
      
      // Sort by most recent message
      return updatedConversations.sort((a, b) => {
        const dateA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp) : new Date(0);
        const dateB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp) : new Date(0);
        return dateB - dateA;
      });
    });
  };
  
  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p !== userEmail) || 'Unknown';
  };
  
  const navigateToChat = async (recipientEmail) => {
    try {
      // Create or get conversation
      const response = await axios.post('http://10.0.2.2:3000/convo/create', {
        participants: [userEmail, recipientEmail]
      });
      
      if (response.data.success) {
        navigation.navigate('Chat', {
          recipientEmail,
          conversationId: response.data.conversation._id
        });
      }
    } catch (error) {
      console.error('Error navigating to chat:', error);
    }
  };
  
  const renderConversationItem = ({ item }) => {
    const otherUser = getOtherParticipant(item);
    const lastMessageTime = item.lastMessage?.timestamp 
      ? new Date(item.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
    const isLastMessageFromMe = item.lastMessage?.sender === userEmail;
    
    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => navigateToChat(otherUser)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{otherUser.charAt(0).toUpperCase()}</Text>
        </View>
        
        <View style={styles.conversationDetails}>
          <View style={styles.conversationHeader}>
            <Text style={styles.username}>{otherUser}</Text>
            <Text style={styles.timestamp}>{lastMessageTime}</Text>
          </View>
          
          {item.lastMessage && (
            <View style={styles.lastMessageContainer}>
              {isLastMessageFromMe && <Text style={styles.sender}>You: </Text>}
              <Text 
                style={styles.lastMessage}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.lastMessage.text}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const startNewChat = () => {
    // Navigate to user search or contacts screen
    navigation.navigate('Contacts');
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversations</Text>
        <TouchableOpacity style={styles.newChatButton} onPress={startNewChat}>
          <Text style={styles.newChatButtonText}>New Chat</Text>
        </TouchableOpacity>
      </View>
      
      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No conversations yet</Text>
          <TouchableOpacity style={styles.startChatButton} onPress={startNewChat}>
            <Text style={styles.startChatButtonText}>Start a chat</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderConversationItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#075E54',
    elevation: 4
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  newChatButton: {
    padding: 8
  },
  newChatButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20
  },
  startChatButton: {
    backgroundColor: '#075E54',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  startChatButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  listContainer: {
    paddingVertical: 8
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#128C7E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold'
  },
  conversationDetails: {
    flex: 1,
    justifyContent: 'center'
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000'
  },
  timestamp: {
    fontSize: 12,
    color: '#666666'
  },
  lastMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sender: {
    fontWeight: 'bold',
    color: '#666666'
  },
  lastMessage: {
    color: '#666666',
    flex: 1
  }
});

export default ConversationsListScreen;