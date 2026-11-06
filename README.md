Chef’s Menu Manager

Project Overview
Chef’s Menu Manager is a mobile application developed using React Native and Expo. It allows a chef to manage restaurant menu items, search and filter dishes, and view menu statistics.

Features Implemented

1. Menu Management
* Add new menu items.
* Edit existing menu items.
* Update dish names, descriptions, courses and prices.
* Delete menu items with a confirmation message.
* Display changes immediately.

2. Search and Filtering
* Search for menu items by dish name.
* Filter menu items by Starter, Main Course or Dessert.
* Clear the search and filter to display all menu items again.

3. Menu Statistics
* Display the total number of menu items.
* Calculate the average price of menu items.
* Count the number of items in each course.
* Display statistics automatically based on the current menu data.
* Present statistics using cards and course breakdown indicators.

4. User Interface Improvements
* Improved the overall application layout.
* Used consistent colours and styling.
* Added reusable buttons and menu item components.
* Improved navigation between application screens.
* Added clear success and error messages.

5. Validation and User Experience
* Required fields are validated before saving.
* Invalid prices are rejected.
* Confirmation is required before deleting a menu item.
* Success messages are displayed after adding, editing and deleting items.
* Empty menu and no-search-results messages are provided.

#Change Log: Improvements Since Part 2
The following changes were implemented:
1. Added functionality to edit existing menu items.
2. Added functionality to delete menu items.
3. Added search functionality to find dishes by name.
4. Added course filtering for starters, main courses and desserts.
5. Added automatic menu statistics.
6. Added average menu price calculations.
7. Added course-based menu item counts.
8. Improved the user interface and application layout.
9. Added input validation and user feedback messages.
10. Improved code organisation through reusable components and functions.

#Testing
The following application functions were tested:
Feature	                   Result
Add menu item	           Successful
Edit menu item	           Successful
Delete menu item	       Successful
Search menu items	       Successful
Filter by course	       Successful
Calculate menu statistics  Successful
Validate form inputs	   Implemented

#Technologies Used
* React Native
* JavaScript
* Expo
* Visual Studio Code

#Running the Application
1. Open the project folder in Visual Studio Code.
2. Open the terminal.
3. Install project dependencies if required:
    npm install
4. Start the Expo development server:
    npx expo start
5. Open the application using Expo Go or a supported web browser.

#Notes
Menu items are currently stored in application state. This means that changes are available while the application is running but are not permanently saved after the application restarts.

#Conclusion
Chef’s Menu Manager has been enhanced with menu management, search and filtering, automatic statistics, input validation and improved user experience. These improvements build on the application developed in Part 2 and address the requirements of the final Portfolio of Evidence.