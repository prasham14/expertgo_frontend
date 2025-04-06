import { Text, View, FlatList, TouchableOpacity, Modal, Pressable, Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles/Recomendations';

const Recomendations = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Using standard React Native Animated API instead of Reanimated
  useEffect(() => {
    if (modalVisible) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Reset animation when modal closes
      scaleAnim.setValue(1);
    }
  }, [modalVisible]);

  const recommendedData = [
    { 
      id: '1', 
      emoji: '🚀', 
      title: 'Tech Trends', 
      subtitle: 'Discover the latest in tech innovations.',
      gradientColors: ['#4F46E5', '#7C3AED'],
      content: 'Explore cutting-edge AI advancements, quantum computing breakthroughs, and emerging technologies shaping our future. Stay ahead with insights from industry pioneers and early adoption strategies for competitive advantage.'
    },
    { 
      id: '2', 
      emoji: '🎨', 
      title: 'Portfolio Tips', 
      subtitle: 'Maximize your impact as an expert.',
      gradientColors: ['#EC4899', '#8B5CF6'],
      content: 'Transform your portfolio with immersive 3D showcases, interactive demonstrations, and personalized user journeys. Learn how to highlight your innovative process and demonstrate measurable impact through compelling case studies.'
    },
    { 
      id: '3', 
      emoji: '📈', 
      title: 'Business Growth', 
      subtitle: 'Strategies to scale your business.',
      gradientColors: ['#10B981', '#3B82F6'],
      content: 'Implement data-driven growth strategies using predictive analytics, market expansion playbooks, and customer-centric optimization. Discover how to leverage emerging markets and create sustainable business models for long-term success.'
    },
    { 
      id: '4', 
      emoji: '🧠', 
      title: 'Productivity Hacks', 
      subtitle: 'Work smarter, not harder!',
      gradientColors: ['#F59E0B', '#EF4444'],
      content: 'Boost your efficiency with AI-powered workflows, neural-linked task management, and biometric optimization techniques. Learn how to implement flow-state triggers and develop personalized productivity systems tailored to your cognitive patterns.'
    },
    { 
      id: '5', 
      emoji: '💼', 
      title: 'Career Advice', 
      subtitle: 'Boost your career with expert tips.',
      gradientColors: ['#06B6D4', '#3B82F6'],
      content: 'Navigate the evolving career landscape with guidance on digital skill development, remote work optimization, and personal brand amplification. Discover strategies for human-AI collaboration and positioning yourself in high-growth industries.'
    },
  ];

  const handleCardPress = (item) => {
    console.log('Card pressed:', item.title); // Add logging
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderModal = () => {
    console.log('Rendering modal, visible:', modalVisible, 'item:', selectedItem?.title); // Add logging
    
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Modal closing via request close');
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent, 
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            {selectedItem ? (
              <LinearGradient
                colors={selectedItem.gradientColors}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.modalGradient}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalEmoji}>{selectedItem.emoji}</Text>
                  <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                  <Pressable 
                    style={styles.closeButton}
                    onPress={() => {
                      console.log('Close button pressed');
                      setModalVisible(false);
                    }}
                  >
                    <Icon name="close-circle" size={32} color="#FFFFFF" />
                  </Pressable>
                </View>
                
                <View style={styles.modalBody}>
                  <Text style={styles.modalSubtitle}>{selectedItem.subtitle}</Text>
                  <Text style={styles.modalContent}>{selectedItem.content}</Text>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => {
                      console.log('Action button pressed');
                      // Add your action here
                    }}
                  >
                    <Icon name="arrow-forward-circle" size={24} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Explore Now</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            ):(null)}
          </Animated.View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.recommendedSection}>
      <Text style={styles.sectionTitle}>✦ Recommended For You</Text>
      
      <FlatList
        data={recommendedData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => handleCardPress(item)}
          >
            <View>
              <LinearGradient
                colors={item.gradientColors}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.recommendedCard}
              >
                <View style={styles.cardContent}>
                  <View style={styles.emojiContainer}>
                    <Text style={styles.emoji}>{item.emoji}</Text>
                  </View>
                  <Text style={styles.recommendedTitle}>{item.title}</Text>
                  <Text style={styles.recommendedSubtitle}>{item.subtitle}</Text>
                  
                  <View style={styles.cardFooter}>
                    <Icon name="chevron-forward" size={20} color="#FFFFFF" />
                  </View>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.recommendedList}
      />
      
      {renderModal()}
    </View>
  );
};

export default Recomendations;