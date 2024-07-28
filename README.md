# chat-App

## Overview
  Chat-App is a real-time chat application developed as graduation project for the ALX course.
  This project was built using MySQL, React and Node.js with Express.
  The application allows users to sign-up, log-in, communicate with other, change profile picture, change name and change bio.

## Features
  * User authentication(sign-up, log-in, log-out and delete account)
  * Real-time messaging with WebSockets
  * User profile management
  * Google Log-in and Sign-up
  * Save message and user data using MySQL
  * Secure password storage and validation
  * cashing user data

## Tech Stack
  * Frontend: React
  * Backend: Node.js with Express
  * Database: MySQL
  * Authentication: JWT, Google Sign-In
  * Real-Time Communication: WebSocket
  * caching data: redis

## Setup
  1. clone the repo
  ```
  git clone https://github.com/malakehab2003/chat-app
  cd chat-app
  ```

  2. Install frontend dependencies
  ```
  cd Front-end
  npm install
  ```

  3. Install backend dependencies
  ```
  cd Back-end
  npm install
  ```

  4. create .env file
```
JWT_SECRET_KEY=
TOKEN_HEADER_KEY=
DEBUG=*
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_DIALECT=
MYSQL_ROOT_USER=
MYSQL_ROOT_PASSWORD=
```

  6. run the backend server
```
cd Back-end
npm start
```

  7. run the frontend
     ```
       cd Front-end
       npx vite --port=4000
     ```

  ## contributors

    David John - https://github.com/DJ-Man-2099
    Malak Shnouda - https://github.com/malakehab2003
