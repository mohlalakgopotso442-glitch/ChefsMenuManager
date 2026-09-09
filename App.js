import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export default function App() {

  // =========================
  // SCREEN
  // =========================

  const [screen, setScreen] = useState('home');

  // =========================
  // FORM
  // =========================

  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');

  // =========================
  // MENU ITEMS
  // =========================

  const [menuItems, setMenuItems] = useState([]);

  // =========================
  // MESSAGES
  // =========================

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // =========================
  // CLEAR FORM
  // =========================

  const clearForm = () => {
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
  };

  // =========================
  // OPEN ADD SCREEN
  // =========================

  const openAddScreen = () => {
    clearForm();
    setErrorMessage('');
    setSuccessMessage('');
    setScreen('add');
  };

  // =========================
  // ADD MENU ITEM
  // =========================

  const addMenuItem = () => {

    // Clear old error
    setErrorMessage('');

    // Check required fields
    if (
      dishName.trim() === '' ||
      description.trim() === '' ||
      course === '' ||
      price.trim() === ''
    ) {
      setErrorMessage(
        'All required fields must be completed before saving.'
      );

      return;
    }

    // Check price
    const numericPrice = Number(price);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      setErrorMessage(
        'Please enter a valid price greater than 0.'
      );

      return;
    }

    // Create menu item
    const newItem = {
      id: Date.now().toString(),
      name: dishName.trim(),
      description: description.trim(),
      course: course,
      price: numericPrice,
    };

    // Add to list
    setMenuItems((currentItems) => [
      ...currentItems,
      newItem,
    ]);

    // Clear the form
    clearForm();

    // Show success message
    setSuccessMessage(
      'Menu item added successfully!'
    );
  };

  // =========================
  // CLOSE SUCCESS MESSAGE
  // =========================

  const closeSuccessMessage = () => {
    setSuccessMessage('');
    setScreen('home');
  };

  // =========================
  // CANCEL
  // =========================

  const cancelForm = () => {
    clearForm();
    setErrorMessage('');
    setSuccessMessage('');
    setScreen('home');
  };

  // =====================================================
  // HOME / MENU SCREEN
  // =====================================================

  if (screen === 'home') {

    return (
      <SafeAreaView style={styles.safeArea}>

        <ScrollView
          style={styles.page}
          contentContainerStyle={styles.scrollContent}
        >

          <View style={styles.homeCard}>

            {/* TITLE */}

            <Text style={styles.homeTitle}>
              Chef's Menu
            </Text>

            <Text style={styles.homeSubtitle}>
              Manage your restaurant menu
            </Text>

            {/* ADD MENU ITEM */}

            <Pressable
              style={styles.addMenuButton}
              onPress={openAddScreen}
            >

              <Text style={styles.addMenuButtonText}>
                + Add menu item
              </Text>

            </Pressable>

            {/* MENU ITEMS */}

            <Text style={styles.menuHeading}>
              MENU ITEMS
            </Text>

            {menuItems.length === 0 ? (

              <View style={styles.emptyBox}>

                <Text style={styles.emptyTitle}>
                  No menu items yet
                </Text>

                <Text style={styles.emptyText}>
                  Add your first menu item to get started.
                </Text>

              </View>

            ) : (

              <View style={styles.list}>

                {menuItems.map((item) => (

                  <View
                    key={item.id}
                    style={styles.menuCard}
                  >

                    <View style={styles.menuInfo}>

                      <Text style={styles.dishTitle}>
                        {item.name}
                      </Text>

                      <Text style={styles.courseText}>
                        {item.course}
                      </Text>

                      <Text style={styles.descriptionText}>
                        {item.description}
                      </Text>

                    </View>

                    <Text style={styles.priceText}>
                      R{item.price.toFixed(2)}
                    </Text>

                  </View>

                ))}

              </View>

            )}

            {/* NUMBER OF ITEMS */}

            <Text style={styles.itemCountText}>
              {menuItems.length}{' '}
              {menuItems.length === 1
                ? 'menu item'
                : 'menu items'}
            </Text>

            <Text style={styles.footerText}>
              Your added menu items will appear here.
            </Text>

          </View>

        </ScrollView>

      </SafeAreaView>
    );
  }

  // =====================================================
  // ADD MENU ITEM SCREEN
  // =====================================================

  if (screen === 'add') {

    return (
      <SafeAreaView style={styles.safeArea}>

        <ScrollView
          style={styles.page}
          contentContainerStyle={styles.scrollContent}
        >

          <View style={styles.appCard}>

            {/* TITLE */}

            <Text style={styles.addTitle}>
              Add menu item
            </Text>

            <Text style={styles.addSubtitle}>
              Create a new item for the restaurant menu.
            </Text>

            {/* =================================
                VALIDATION ERROR
            ================================= */}

            {errorMessage !== '' && (

              <View style={styles.errorBox}>

                <Text style={styles.errorTitle}>
                  Validation Error
                </Text>

                <Text style={styles.errorText}>
                  {errorMessage}
                </Text>

              </View>

            )}

            {/* =================================
                SUCCESS MESSAGE
            ================================= */}

            {successMessage !== '' && (

              <View style={styles.successBox}>

                <Text style={styles.successTitle}>
                  Success
                </Text>

                <Text style={styles.successText}>
                  {successMessage}
                </Text>

                <Pressable
                  style={styles.okButton}
                  onPress={closeSuccessMessage}
                >

                  <Text style={styles.okButtonText}>
                    OK
                  </Text>

                </Pressable>

              </View>

            )}

            {/* DISH NAME */}

            <Text style={styles.label}>
              Dish Name
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter dish name"
              placeholderTextColor="#77727d"
              value={dishName}
              onChangeText={(text) => {
                setDishName(text);
                setErrorMessage('');
              }}
              editable={successMessage === ''}
            />

            {/* DESCRIPTION */}

            <Text style={styles.label}>
              Description
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.descriptionInput,
              ]}
              placeholder="Enter dish description"
              placeholderTextColor="#77727d"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setErrorMessage('');
              }}
              multiline
              editable={successMessage === ''}
            />

            {/* COURSE */}

            <Text style={styles.label}>
              Course
            </Text>

            <View style={styles.courseContainer}>

              {/* STARTER */}

              <Pressable
                style={[
                  styles.courseButton,
                  course === 'Starter' &&
                    styles.selectedCourse,
                ]}
                onPress={() => {
                  setCourse('Starter');
                  setErrorMessage('');
                }}
                disabled={successMessage !== ''}
              >

                <Text
                  style={[
                    styles.courseButtonText,
                    course === 'Starter' &&
                      styles.selectedCourseText,
                  ]}
                >
                  Starter
                </Text>

              </Pressable>

              {/* MAIN COURSE */}

              <Pressable
                style={[
                  styles.courseButton,
                  course === 'Main Course' &&
                    styles.selectedCourse,
                ]}
                onPress={() => {
                  setCourse('Main Course');
                  setErrorMessage('');
                }}
                disabled={successMessage !== ''}
              >

                <Text
                  style={[
                    styles.courseButtonText,
                    course === 'Main Course' &&
                      styles.selectedCourseText,
                  ]}
                >
                  Main Course
                </Text>

              </Pressable>

              {/* DESSERT */}

              <Pressable
                style={[
                  styles.courseButton,
                  course === 'Dessert' &&
                    styles.selectedCourse,
                ]}
                onPress={() => {
                  setCourse('Dessert');
                  setErrorMessage('');
                }}
                disabled={successMessage !== ''}
              >

                <Text
                  style={[
                    styles.courseButtonText,
                    course === 'Dessert' &&
                      styles.selectedCourseText,
                  ]}
                >
                  Dessert
                </Text>

              </Pressable>

            </View>

            {/* PRICE */}

            <Text style={styles.label}>
              Price
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter price"
              placeholderTextColor="#77727d"
              value={price}
              onChangeText={(text) => {
                setPrice(text);
                setErrorMessage('');
              }}
              keyboardType="numeric"
              editable={successMessage === ''}
            />

            {/* SAVE */}

            <Pressable
              style={styles.saveButton}
              onPress={addMenuItem}
              disabled={successMessage !== ''}
            >

              <Text style={styles.saveButtonText}>
                Save menu item
              </Text>

            </Pressable>

            {/* CANCEL */}

            <Pressable
              style={styles.cancelButton}
              onPress={cancelForm}
              disabled={successMessage !== ''}
            >

              <Text style={styles.cancelButtonText}>
                Cancel
              </Text>

            </Pressable>

            {/* VALIDATION INFORMATION */}

            <View style={styles.validationBox}>

              <Text style={styles.validationTitle}>
                Validation
              </Text>

              <Text style={styles.validationText}>
                All required fields must be completed before saving.
              </Text>

              <Text style={styles.validationText}>
                Enter a valid price greater than 0.
              </Text>

            </View>

          </View>

        </ScrollView>

      </SafeAreaView>
    );
  }

  return null;
}


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  // GENERAL

  safeArea: {
    flex: 1,
    backgroundColor: '#eeeeee',
  },

  page: {
    flex: 1,
    backgroundColor: '#eeeeee',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },

  // HOME

  homeCard: {
    width: '100%',
    maxWidth: 500,
    minHeight: 650,
    backgroundColor: '#fbf7ee',
    borderRadius: 28,
    padding: 30,
  },

  homeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#242124',
    marginBottom: 6,
  },

  homeSubtitle: {
    fontSize: 16,
    color: '#77727d',
    marginBottom: 25,
  },

  addMenuButton: {
    backgroundColor: '#7041b6',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
  },

  addMenuButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  // MENU

  menuHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#77727d',
    letterSpacing: 1,
    marginBottom: 12,
  },

  list: {
    width: '100%',
    marginBottom: 20,
  },

  menuCard: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd8de',
    paddingVertical: 18,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  menuInfo: {
    flex: 1,
    paddingRight: 10,
  },

  dishTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#302d32',
    marginBottom: 5,
  },

  courseText: {
    fontSize: 13,
    color: '#77727d',
  },

  descriptionText: {
    fontSize: 13,
    color: '#77727d',
    marginTop: 5,
  },

  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#302d32',
  },

  // EMPTY

  emptyBox: {
    backgroundColor: '#e8e1ec',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#302d32',
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    color: '#77727d',
    textAlign: 'center',
  },

  itemCountText: {
    textAlign: 'center',
    color: '#77727d',
    fontSize: 14,
    marginTop: 10,
  },

  footerText: {
    textAlign: 'center',
    color: '#77727d',
    fontSize: 13,
    marginTop: 18,
  },

  // ADD CARD

  appCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fbf7ee',
    borderRadius: 28,
    padding: 30,
  },

  addTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#242124',
    marginBottom: 6,
  },

  addSubtitle: {
    fontSize: 15,
    color: '#77727d',
    marginBottom: 28,
  },

  // FORM

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#302d32',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#e8e1ec',
    borderRadius: 13,
    minHeight: 50,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#302d32',
    marginBottom: 20,
  },

  descriptionInput: {
    minHeight: 90,
    paddingTop: 14,
    textAlignVertical: 'top',
  },

  // COURSE

  courseContainer: {
    marginBottom: 20,
  },

  courseButton: {
    backgroundColor: '#e8e1ec',
    borderRadius: 13,
    paddingVertical: 14,
    marginBottom: 8,
  },

  selectedCourse: {
    backgroundColor: '#7041b6',
  },

  courseButtonText: {
    color: '#302d32',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },

  selectedCourseText: {
    color: '#ffffff',
  },

  // SAVE

  saveButton: {
    backgroundColor: '#7041b6',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  // CANCEL

  cancelButton: {
    backgroundColor: '#e8e1ec',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 25,
  },

  cancelButtonText: {
    color: '#302d32',
    fontSize: 16,
    fontWeight: '700',
  },

  // VALIDATION INFORMATION

  validationBox: {
    backgroundColor: '#dcebdc',
    borderRadius: 16,
    padding: 18,
  },

  validationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#405340',
    marginBottom: 8,
  },

  validationText: {
    fontSize: 13,
    color: '#4d594d',
    lineHeight: 19,
    marginBottom: 3,
  },

  // ERROR MESSAGE

  errorBox: {
    backgroundColor: '#f8dddd',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e8bcbc',
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9b3030',
    marginBottom: 6,
  },

  errorText: {
    fontSize: 13,
    color: '#7d3a3a',
    lineHeight: 19,
  },

  // SUCCESS MESSAGE

  successBox: {
    backgroundColor: '#dcebdc',
    borderRadius: 18,
    padding: 20,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#bfd8bf',
  },

  successTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#405340',
    marginBottom: 7,
  },

  successText: {
    fontSize: 14,
    color: '#4d594d',
    marginBottom: 15,
  },

  okButton: {
    backgroundColor: '#7041b6',
    borderRadius: 13,
    paddingVertical: 13,
    alignItems: 'center',
  },

  okButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },

});