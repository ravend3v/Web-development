# Web-development

This repository contains various web development projects and tasks. Each task is organized into its own folder for easy navigation. Below is a guide to help you find and understand each task, including the **yksilötehtävä** project.

---

## Table of Contents
- [Overview](#overview)
- [Projects and Tasks](#projects-and-tasks)
    - [yksilötehtävä](#yksilötehtävä)
- [How to Run](#how-to-run)
- [Technologies Used](#technologies-used)

---

## Overview
This repository is a collection of web development exercises and projects designed to practice and demonstrate various web technologies, including HTML, CSS, JavaScript, and libraries like SweetAlert2.

---

## Projects and Tasks

### 1. **yksilötehtävä**
The **yksilötehtävä** project is a user authentication system that includes:
- **Login functionality**: Users can log in with a username and password.
- **Registration functionality**: New users can register with a username and password.
- **Password hashing**: Passwords are securely hashed using the `crypto.subtle` API with the SHA-256 algorithm.
- **LocalStorage**: User data is stored in the browser's `localStorage` for simplicity.
- **User-friendly notifications**: SweetAlert2 is used to provide modern and visually appealing notifications for actions like successful login, registration, and error handling.

#### Libraries and Methods Used:
- **SweetAlert2**: For user-friendly notifications.
- **crypto.subtle API**: To hash passwords securely using the SHA-256 algorithm.
- **Leaflet.js**: For interactive maps and geolocation features.
- **OpenStreetMap Tiles**: Used as the base map layer for Leaflet.js.
- **LocalStorage**: To store user data persistently in the browser.
- **JavaScript DOM Manipulation**: For handling form submissions and user interactions.

#### File Structure:
- `scripts/login.js`: Handles user login functionality.
- `scripts/register.js`: Handles user registration functionality.
- `scripts/map.js`: Handles leaflet for all the map functionalities and tiles
- `scripts/profile.js`: Handles the user profile updating and displaying logic

##### Pages
- `index.html`: Main page of the application.
- `templates/login.html`: Is responsible for the layout of the login page
- `templates/register.html`: Is responsible for the layout of the register page
- `templates/profile.html`: Is responsible for the layout of the user profile page

##### Styles
- `styles/`: Contains CSS files for styling the above pages.

---

## How to Run
1. Clone the repository:
     ```bash
     git clone https://github.com/your-username/Web-development.git
     ```

---

## Technologies Used
This project utilizes the following technologies and tools:
- **HTML5**: For structuring the web pages.
- **CSS3**: For styling and layout design.
- **JavaScript (ES6+)**: For dynamic functionality and interactivity.
- **SweetAlert2**: For modern alert and notification popups.
- **Leaflet.js**: For interactive maps and geolocation features.
- **OpenStreetMap**: As the map tile provider for Leaflet.js.
- **crypto.subtle API**: For secure password hashing using SHA-256.
- **LocalStorage**: For storing user data persistently in the browser.
- **Git**: For version control and collaboration.
