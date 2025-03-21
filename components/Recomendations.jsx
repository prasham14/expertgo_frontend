import { Text, View, FlatList } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles/Recomendations';
const Recommendations = () => {
  const recommendedData = [
    { id: '1', emoji: '🚀', title: 'Tech Trends', subtitle: 'Discover the latest in tech innovations.' },
    { id: '2', emoji: '🎨', title: 'Portfolio Tips', subtitle: 'Maximize your impact as an expert.' },
    { id: '3', emoji: '📈', title: 'Business Growth', subtitle: 'Strategies to scale your business.' },
    { id: '4', emoji: '🧠', title: 'Productivity Hacks', subtitle: 'Work smarter, not harder!' },
    { id: '5', emoji: '💼', title: 'Career Advice', subtitle: 'Boost your career with expert tips.' },
  ];

  return (
    <View style={styles.recommendedSection}>
      <Text style={styles.sectionTitle}>✨ Recommended For You</Text>
      <FlatList
        data={recommendedData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LinearGradient 
            colors={['#E3F2FD', '#BBDEFB']}  // Soft blue gradient
            style={styles.recommendedCard}
          >
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.recommendedTitle}>{item.title}</Text>
            <Text style={styles.recommendedSubtitle}>{item.subtitle}</Text>
          </LinearGradient>
        )}
        contentContainerStyle={styles.recommendedList}
      />
    </View>
  );
};

export default Recommendations;
