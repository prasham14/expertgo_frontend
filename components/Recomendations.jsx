import { Text, View, FlatList } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

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

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  recommendedSection: {
    marginVertical: 30,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1565C0', // Soft deep blue
    marginBottom: 20,
  },

  recommendedList: {
    paddingHorizontal: 15,
  },

  recommendedCard: {
    padding: 20,
    borderRadius: 15,
    marginRight: 15,
    minWidth: 230,
    minHeight: 140,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    justifyContent: 'center',
  },

  emojiContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)', 
    padding: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },

  emoji: {
    fontSize: 24,
  },

  recommendedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D47A1', // Darker blue for contrast
    marginBottom: 6,
  },

  recommendedSubtitle: {
    fontSize: 14,
    color: '#424242', // Neutral dark gray for readability
    opacity: 0.9,
  },
});
