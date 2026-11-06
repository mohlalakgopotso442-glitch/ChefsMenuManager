import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

const COURSES = ['Starter', 'Main Course', 'Dessert'];

export default function App() {
  // START WITH AN EMPTY MENU
  const [menuItems, setMenuItems] = useState([]);

  const [screen, setScreen] = useState('home');
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [message, setMessage] = useState('');

  // STATISTICS CALCULATED FROM THE MENU
  const totalItems = menuItems.length;

  const starterCount = menuItems.filter(
    item => item.course === 'Starter'
  ).length;

  const mainCount = menuItems.filter(
    item => item.course === 'Main Course'
  ).length;

  const dessertCount = menuItems.filter(
    item => item.course === 'Dessert'
  ).length;

  const totalPrice = menuItems.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const averagePrice =
    totalItems === 0 ? 0 : totalPrice / totalItems;

  // SEARCH AND FILTER
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.trim().toLowerCase());

    const matchesFilter =
      selectedFilter === 'All' ||
      item.course === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  // CLEAR INPUTS
  const clearForm = () => {
    setDishName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');
    setEditingId(null);
    setMessage('');
  };

  const openAdd = () => {
    clearForm();
    setScreen('add');
  };

  const openEdit = item => {
    setDishName(item.name);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(String(item.price));
    setEditingId(item.id);
    setMessage('');
    setScreen('edit');
  };

  // VALIDATE AND SAVE
  const saveItem = () => {
    if (!dishName.trim()) {
      setMessage('Please enter a dish name.');
      return;
    }

    if (!description.trim()) {
      setMessage('Please enter a description.');
      return;
    }

    if (!price.trim()) {
      setMessage('Please enter a price.');
      return;
    }

    const numericPrice = Number(price.replace(',', '.'));

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setMessage('Please enter a valid price greater than zero.');
      return;
    }

    const itemData = {
      name: dishName.trim(),
      description: description.trim(),
      course,
      price: numericPrice,
    };

    if (screen === 'edit' && editingId !== null) {
      setMenuItems(current =>
        current.map(item =>
          item.id === editingId
            ? { ...item, ...itemData }
            : item
        )
      );
    } else {
      const newItem = {
        id:
          Date.now().toString() +
          '-' +
          Math.random().toString(36).slice(2),
        ...itemData,
      };

      setMenuItems(current => [...current, newItem]);
    }

    const successMessage =
      screen === 'edit'
        ? 'Menu item updated successfully.'
        : 'Menu item added successfully.';

    clearForm();
    setMessage(successMessage);
    setScreen('home');
  };

  // DELETE - STEP 1: SHOW CONFIRMATION
  const deleteMenuItem = item => {
    setDeleteTarget(item);
  };

  // DELETE - STEP 2: REMOVE SELECTED ITEM
  const confirmDelete = () => {
    if (!deleteTarget) return;

    const targetId = deleteTarget.id;

    setMenuItems(current =>
      current.filter(item => item.id !== targetId)
    );

    setDeleteTarget(null);
    setMessage('Menu item deleted successfully.');
  };

  // REUSABLE BUTTON
  const AppButton = ({
    title,
    onPress,
    secondary = false,
  }) => (
    <TouchableOpacity
      style={[
        styles.button,
        secondary && styles.secondaryButton,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.buttonText,
          secondary && styles.secondaryButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  // HOME SCREEN
  const renderHome = () => (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Chef's Menu</Text>
        <Text style={styles.subtitle}>
          Manage your restaurant menu
        </Text>
      </View>

      <AppButton
        title="+ Add Menu Item"
        onPress={openAdd}
      />

      {message ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>{message}</Text>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Menu Items</Text>

      <TextInput
        style={styles.input}
        placeholder="Search dishes by name..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />

      <Text style={styles.label}>Filter by course</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        keyboardShouldPersistTaps="handled"
      >
        {['All', ...COURSES].map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterChip,
              selectedFilter === option &&
                styles.activeChip,
            ]}
            onPress={() => setSelectedFilter(option)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === option &&
                  styles.activeChipText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.itemCount}>
        Showing {filteredItems.length} of {totalItems} items
      </Text>

      {filteredItems.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            {totalItems === 0
              ? 'Your menu is empty'
              : 'No matching menu items'}
          </Text>
          <Text style={styles.emptyDescription}>
            {totalItems === 0
              ? 'Add your first dish to get started.'
              : 'Try a different search or course filter.'}
          </Text>
        </View>
      ) : (
        filteredItems.map(item => (
          <View key={item.id} style={styles.menuCard}>
            <View style={styles.menuTop}>
              <View style={styles.menuInfo}>
                <Text style={styles.dishTitle}>
                  {item.name}
                </Text>
                <Text style={styles.courseLabel}>
                  {item.course}
                </Text>
              </View>

              <Text style={styles.dishPrice}>
                R{item.price.toFixed(2)}
              </Text>
            </View>

            <Text style={styles.description}>
              {item.description}
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => openEdit(item)}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteMenuItem(item)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <AppButton
        title="View Statistics"
        onPress={() => {
          setMessage('');
          setScreen('statistics');
        }}
      />
    </ScrollView>
  );

  // ADD / EDIT SCREEN
  const renderForm = () => (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>
        {screen === 'edit'
          ? 'Edit Menu Item'
          : 'Add Menu Item'}
      </Text>

      <Text style={styles.subtitle}>
        {screen === 'edit'
          ? 'Update your dish details'
          : 'Enter your new dish details'}
      </Text>

      <Text style={styles.label}>Dish Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter dish name"
        placeholderTextColor="#888"
        value={dishName}
        onChangeText={setDishName}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Enter dish description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Course</Text>

      <View style={styles.courseRow}>
        {COURSES.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.courseButton,
              course === option &&
                styles.selectedCourseButton,
            ]}
            onPress={() => setCourse(option)}
          >
            <Text
              style={[
                styles.courseButtonText,
                course === option &&
                  styles.selectedCourseText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Price (R)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        placeholderTextColor="#888"
        keyboardType="decimal-pad"
        value={price}
        onChangeText={setPrice}
      />

      {message ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{message}</Text>
        </View>
      ) : null}

      <View style={styles.formActions}>
        <AppButton
          title={
            screen === 'edit'
              ? 'Update Menu Item'
              : 'Save Menu Item'
          }
          onPress={saveItem}
        />

        <AppButton
          title="Cancel"
          secondary
          onPress={() => {
            clearForm();
            setScreen('home');
          }}
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>
          Menu Item Guidelines
        </Text>
        <Text style={styles.infoText}>
          Complete every field, select the correct course,
          and enter a price greater than zero.
        </Text>
      </View>
    </ScrollView>
  );

  // STATISTICS CARD
  const StatCard = ({ number, label }) => (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  // STATISTICS SCREEN
  const renderStatistics = () => {
    const breakdown = [
      { name: 'Starters', count: starterCount },
      { name: 'Main Courses', count: mainCount },
      { name: 'Desserts', count: dessertCount },
    ];

    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Menu Statistics</Text>
        <Text style={styles.subtitle}>
          Your menu overview
        </Text>

        <View style={styles.statsGrid}>
          <StatCard
            number={totalItems}
            label="Total Items"
          />
          <StatCard
            number={starterCount}
            label="Starters"
          />
          <StatCard
            number={mainCount}
            label="Main Courses"
          />
          <StatCard
            number={dessertCount}
            label="Desserts"
          />
        </View>

        <View style={styles.averageBox}>
          <Text style={styles.averageTitle}>
            Average Menu Price
          </Text>
          <Text style={styles.averagePrice}>
            R{averagePrice.toFixed(2)}
          </Text>
          <Text style={styles.averageNote}>
            Calculated from {totalItems} menu items
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Course Breakdown
        </Text>

        {breakdown.map(item => {
          const percentage =
            totalItems === 0
              ? 0
              : (item.count / totalItems) * 100;

          return (
            <View
              key={item.name}
              style={styles.breakdownCard}
            >
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownName}>
                  {item.name}
                </Text>
                <Text style={styles.breakdownCount}>
                  {item.count} items
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${percentage}%` },
                  ]}
                />
              </View>

              <Text style={styles.percentage}>
                {percentage.toFixed(1)}%
              </Text>
            </View>
          );
        })}

        {totalItems === 0 ? (
          <Text style={styles.statsEmpty}>
            No menu items yet. Add dishes to see your
            statistics update.
          </Text>
        ) : null}

        <AppButton
          title="Back to Menu"
          onPress={() => setScreen('home')}
        />
      </ScrollView>
    );
  };

  // MAIN DISPLAY
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8F5EF"
      />

      {screen === 'home' && renderHome()}
      {(screen === 'add' || screen === 'edit') &&
        renderForm()}
      {screen === 'statistics' && renderStatistics()}

      {/* DELETE CONFIRMATION OVERLAY */}
      {deleteTarget !== null && (
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>
              Delete Menu Item?
            </Text>

            <Text style={styles.dialogText}>
              Are you sure you want to delete
              {' "'}{deleteTarget.name}{'"'}?
              This action cannot be undone.
            </Text>

            <View style={styles.dialogButtons}>
              <TouchableOpacity
                style={styles.cancelDeleteButton}
                onPress={() => setDeleteTarget(null)}
              >
                <Text style={styles.cancelDeleteText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={confirmDelete}
              >
                <Text style={styles.confirmDeleteText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F5EF',
  },

  scroll: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 45,
  },

  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
  },

  title: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#493568',
    marginBottom: 7,
  },

  subtitle: {
    fontSize: 15,
    color: '#777078',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#7053A6',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  secondaryButton: {
    backgroundColor: '#EDE7F2',
  },

  secondaryButtonText: {
    color: '#7053A6',
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#493568',
    marginTop: 22,
    marginBottom: 14,
  },

  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#493568',
    marginTop: 14,
    marginBottom: 9,
  },

  input: {
    backgroundColor: '#EDE7F2',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333333',
    marginBottom: 7,
  },

  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },

  filterScroll: {
    marginBottom: 12,
  },

  filterChip: {
    backgroundColor: '#EDE7F2',
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderRadius: 22,
    marginRight: 8,
  },

  activeChip: {
    backgroundColor: '#7053A6',
  },

  filterChipText: {
    color: '#604B7E',
    fontWeight: '600',
  },

  activeChipText: {
    color: '#FFFFFF',
  },

  itemCount: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 13,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 28,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E9E1D7',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#493568',
  },

  emptyDescription: {
    fontSize: 14,
    color: '#777777',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 21,
  },

  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E9E1D7',
    elevation: 2,
  },

  menuTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  menuInfo: {
    flex: 1,
    paddingRight: 10,
  },

  dishTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#493568',
  },

  courseLabel: {
    color: '#8568AD',
    fontSize: 13,
    marginTop: 5,
    fontWeight: '600',
  },

  dishPrice: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#493568',
  },

  description: {
    fontSize: 14,
    color: '#777777',
    marginTop: 12,
    lineHeight: 21,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },

  editButton: {
    flex: 1,
    backgroundColor: '#EDE7F2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },

  editText: {
    color: '#7053A6',
    fontWeight: 'bold',
  },

  deleteButton: {
    flex: 1,
    backgroundColor: '#FCE8E8',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },

  deleteText: {
    color: '#C62828',
    fontWeight: 'bold',
  },

  successBox: {
    backgroundColor: '#E4EDDF',
    padding: 13,
    borderRadius: 9,
    marginTop: 12,
  },

  successText: {
    color: '#365C35',
    fontWeight: '600',
  },

  errorBox: {
    backgroundColor: '#FCE8E8',
    padding: 13,
    borderRadius: 9,
    marginTop: 14,
  },

  errorText: {
    color: '#B3261E',
    fontWeight: '600',
  },

  courseRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 7,
  },

  courseButton: {
    backgroundColor: '#EDE7F2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 13,
  },

  selectedCourseButton: {
    backgroundColor: '#7053A6',
  },

  courseButtonText: {
    color: '#604B7E',
    fontWeight: '600',
  },

  selectedCourseText: {
    color: '#FFFFFF',
  },

  formActions: {
    marginTop: 24,
  },

  infoBox: {
    backgroundColor: '#E4EDDF',
    padding: 17,
    borderRadius: 10,
    marginTop: 20,
  },

  infoTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#365C35',
    marginBottom: 7,
  },

  infoText: {
    color: '#4C6847',
    fontSize: 13,
    lineHeight: 20,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E9E1D7',
  },

  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7053A6',
  },

  statLabel: {
    fontSize: 13,
    color: '#777777',
    textAlign: 'center',
    marginTop: 8,
  },

  averageBox: {
    backgroundColor: '#E4EDDF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 12,
  },

  averageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#365C35',
  },

  averagePrice: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#365C35',
    marginVertical: 10,
  },

  averageNote: {
    color: '#4C6847',
    fontSize: 13,
    textAlign: 'center',
  },

  breakdownCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 13,
  },

  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  breakdownName: {
    color: '#493568',
    fontWeight: 'bold',
  },

  breakdownCount: {
    color: '#777777',
  },

  progressTrack: {
    height: 11,
    borderRadius: 10,
    backgroundColor: '#EDE7F2',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#7053A6',
    borderRadius: 10,
  },

  percentage: {
    color: '#777777',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 7,
  },

  statsEmpty: {
    color: '#777777',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 21,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    zIndex: 10,
    elevation: 10,
  },

  dialog: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 23,
    borderRadius: 14,
  },

  dialogTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#493568',
    marginBottom: 12,
  },

  dialogText: {
    color: '#555555',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 22,
  },

  dialogButtons: {
    flexDirection: 'row',
    gap: 10,
  },

  cancelDeleteButton: {
    flex: 1,
    backgroundColor: '#EDE7F2',
    padding: 13,
    borderRadius: 8,
    alignItems: 'center',
  },

  cancelDeleteText: {
    color: '#7053A6',
    fontWeight: 'bold',
  },

  confirmDeleteButton: {
    flex: 1,
    backgroundColor: '#C62828',
    padding: 13,
    borderRadius: 8,
    alignItems: 'center',
  },

  confirmDeleteText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});