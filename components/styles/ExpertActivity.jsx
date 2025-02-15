import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },

  // 🌟 Header & Titles
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50', // Darker shade for professionalism
    textAlign: 'center',
    marginBottom: 12,
  },

  subHeader: {
    fontSize: 17,
    color: '#7F8C8D', // Muted gray for subtle contrast
    textAlign: 'center',
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 6,
  },

  sectionContent: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12,
  },

  // 🧑‍💼 Expert Section
  expertSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginVertical: 12,
  },

  expertInfo: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 10,
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  // 👤 User Section (For Normal Users)
  userSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginVertical: 12,
  },

  // ⭐ Famous Expert Cards
  expertCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    width: 220, // Slightly larger for better readability
  },

  expertName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 6,
  },

  expertField: {
    fontSize: 15,
    color: '#7F8C8D',
    marginBottom: 6,
  },

  listContent: {
    paddingVertical: 12,
    paddingLeft: 12,
  },

  // 🎯 Buttons
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default styles;