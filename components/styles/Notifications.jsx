// Add these styles to your styles/Notifications.js file

const styles = {
  // Keep your existing styles and add/modify these:
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  removeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  iconContainer: {
    backgroundColor: '#f0f7ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  time: {
    color: '#888',
    fontSize: 12,
  },
  description: {
    color: '#555',
    marginBottom: 6,
  },
  amount: {
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
};

export default styles;