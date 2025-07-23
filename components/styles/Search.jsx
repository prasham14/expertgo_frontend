import { StyleSheet } from "react-native";
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#262626',
    height: '100%',
    paddingVertical: 8,
  },
  clearButton: {
    padding: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
    color: '#262626',
    marginTop: 4,
  },
  
  // Section Styling
  sectionContainer: {
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#262626',
  },
  sectionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
},

scrollHintContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},

scrollHintText: {
  fontSize: 14,
  color: '#000000',
  marginLeft: 4,
},

  // Categories List
  categoriesContainer: {
    paddingRight: 8,
    paddingBottom: 4,
  },
  categoryCard: {
    marginRight: 16,
    alignItems: 'center',
    width: 90,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4267B2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#F7F9FC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#262626',
    textAlign: 'center',
  },
  
  // Search Results
  resultsContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  expertCard: {
    backgroundColor: '#F0F0F2',
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 12,
    position: 'relative',
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  
  featuredExpertImageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  
  featuredExpertImage: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  
  availabilityBadge: {
    position: 'absolute',
    bottom: -5,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  
  unavailableBadge: {
    backgroundColor: '#F44336',
  },
  
  availabilityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  
  expertInfo: {
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  
  expertName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  
  expertCategory: {
    fontSize: 14,
    color: 'green',
    marginBottom: 8,
  },
  
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  expertRating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginRight: 10,
  },
  
  dealsBadge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  
  expertDeals: {
    fontSize: 12,
    color: '#666666',
  },
  
  expertBio: {
    fontSize: 13,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 15,
  },
  
  contactButton: {
    backgroundColor: '#4267B2',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  
  contactButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Featured Experts
  featuredExpertsContainer: {
    paddingRight: 8,
    paddingBottom: 4,
  },
 featuredExpertCard: {
  width: (width - 48) / 2,
  backgroundColor: '#F0F0F2',
  borderRadius: 12,
  padding: 8,
  marginBottom: 16,
  margin:5,

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  borderWidth: 1,
  borderColor: '#F0F0F0',
},

  featuredExpertImageContainer: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  featuredExpertImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
  },
  verifiedBadge: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  featuredExpertName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#262626',
    textAlign: 'center',
    marginBottom: 4,
  },
  featuredExpertCategory: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  featuredExpertRating: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredRatingText: {
    fontSize: 14,
    color: '#262626',
    fontWeight: '600',
    marginLeft: 4,
  },
  visitButton: {
    backgroundColor: '#4267B2',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  visitButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Trending Categories
  trendingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
  },
  trendingText: {
    fontSize: 14,
    color: '#262626',
    marginLeft: 6,
    fontWeight: '500',
  },
  
  // Empty States
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 12,
  },
});

  export default styles;  