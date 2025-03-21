
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

export default styles;