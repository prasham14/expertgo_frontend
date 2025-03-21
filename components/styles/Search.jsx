import { StyleSheet } from "react-native";

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
    backgroundColor: '#0095f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#0095f6',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  expertImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
    backgroundColor: '#F5F5F5',
  },
  expertInfo: {
    flex: 1,
  },
  expertName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#262626',
    marginBottom: 2,
  },
  expertCategory: {
    fontSize: 14,
    color: '#0095f6',
    marginBottom: 4,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  expertRating: {
    fontSize: 13,
    color: '#262626',
    marginLeft: 4,
    marginRight: 8,
    fontWeight: '500',
  },
  expertDeals: {
    fontSize: 13,
    color: '#666666',
  },
  expertBio: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  contactButton: {
    backgroundColor: '#0095f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
    elevation: 1,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Featured Experts
  featuredExpertsContainer: {
    paddingRight: 8,
    paddingBottom: 4,
  },
  featuredExpertCard: {
    width: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 14,
    elevation: 2,
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
    backgroundColor: '#0095f6',
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