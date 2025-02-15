import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF1F6', // Soft modern background
  },

  scrollContainer: {
    paddingHorizontal: 16,
  },

  // 🔹 Top Navigation Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    elevation: 4,
  },

  topBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  // 🔎 Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  searchIcon: {
    marginRight: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },

  resultsContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  recommendationsContainer: {
    padding: 12,
    marginTop: 12,
  },

  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1E293B',
  },

  recommendationList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  recommendationChip: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
  },

  recommendationText: {
    color: '#ffffff',
    fontSize: 14,
  },

  backButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#DC2626',
    borderRadius: 6,
    alignItems: 'center',
  },

  backButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },

  expertCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  expertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  expertTextContainer: {
    marginLeft: 12,
  },

  expertName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  expertCategory: {
    fontSize: 14,
    color: '#6B7280',
  },

  expertDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },

  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
    marginVertical: 20,
  },

  expertCharges: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563EB',
    textAlign: 'right',
  },

  expertRatings: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  expertRating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 4,
  },

  expertBio: {
    fontSize: 14,
    color: '#374151',
    marginTop: 6,
  },

  viewPortfolioButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  viewPortfolioText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
