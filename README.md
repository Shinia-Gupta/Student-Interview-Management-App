# Career Camp -Student Interview Management Project

Career Camp is a student management project developed using the Model-View-Controller (MVC) architecture with a MongoDB Atlas database powered by Mongoose. This project allows users to register as employees, login, view real-time job listings using the RapidAPI, add interviews, add students, update interview status, and schedule interviews with corresponding email notifications.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies_used)
- [Installation](#installation)
- [Contributions](#contributions)
- [Live Project](#live-project)


## Features

1. **Register and Login**: Users can register and login to access the application.
2. **Real-Time Job Listings**: Integration with RapidAPI to display real-time job listings.
3. **Add Interview**: Users can add new interviews to the system.
4. **Add Student**: Ability to add new students to the system.
5. **Update Interview Status**: Users can update the status of interviews.
6. **Schedule Interview**: Feature to schedule interviews with corresponding email notifications.
7. **Download Information**: Users can download student information as a CSV file.

## Technologies Used
- Node.js: Backend runtime environment.
- Express.js: Web application framework for Node.js.
- MongoDB Atlas: Cloud-based NoSQL database service.
- Mongoose: MongoDB object modeling tool designed for Node.js.
- RapidAPI: Platform for accessing and managing APIs.
- Bootstrap: Frontend framework for styling and layout.
- Nodemailer: Module for sending emails from Node.js applications.
  
## Installation

1. **Set up MongoDB Atlas**:
    - Create a MongoDB Atlas account and set up a new cluster.
    - Get the connection URI and replace it in the `.env` file.

2. **Set up RapidAPI**:
    - Sign up for a RapidAPI account and subscribe to the desired job search API.
    - Get the API key and host URL and replace them in the `.env` file.

3. **Start the Server**:

    ```bash
    npm start
    ```

4. **Access the Application**:

    Access the application in your web browser at the set `PORT`.

## Contributions

We welcome contributions from the community! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## Live Project
[Live Project](https://student-interview-management-application.onrender.com)

  


