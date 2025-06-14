﻿﻿<div align="center">
  
  # 🏨 Hotel Management

  *A Web App for Hotel Booking and Management using React and ExpressJS* 📅

  ![ReactJS](https://img.shields.io/badge/React_JS-white?style=for-the-badge&logo=React&logoColor=61DAFB)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-white?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4AC)
  ![NodeJS](https://img.shields.io/badge/Node_JS-white?style=for-the-badge&logo=Node.js&logoColor=5FA04E)
  ![ExpressJS](https://img.shields.io/badge/Express_JS-white?style=for-the-badge&logo=Express&logoColor=000000)
  ![SQL Server](https://img.shields.io/badge/SQL_Server-white?style=for-the-badge)


  <img width="595px" src="https://res.cloudinary.com/dvzhmi7a9/image/upload/v1732635266/HotelManagement/ScreenShots/1-BookingList.png">

  [![Live Demo](https://img.shields.io/badge/🔗_Visit_website-white?style=flat)](https://hotel-management.enkay.tech)

</div>

## 📘 Table of Contents
1. [Introduction](#introduction) 🌟
2. [Team Members](#team-members) 🤝
3. [Technologies](#technologies) 💻
4. [Features](#features) 🔎
5. [Development](#development) ✈️
6. [Contact](#contact) 🌐

## 🌟 <a name="introduction">Introduction</a>

**Hotel Management** is a web application for booking and managing hotel rooms. It is built using ReactJS and ExpressJS. The application allows users to book rooms, manage room, generate invoices, and visualize reports on room occupancy and revenue.

This project is a part of the **Introduction Software Engineering** course at **University of Science**. The project is developed by a team of **4 students**. The project is developed using **Waterfall** methodology.

## 🤝 <a name="team-members">Team Members</a>

- **Hoang Tien Huy** - 22120134 - Database Designer & Backend Developer - [simpleHuy](https://github.com/simpleHuy)
- **Ma Cat Huynh** - 22120144 - Project Manager & QA/QC Engineer - [CatHuyuH24](https://github.com/CatHuyuH24)
- **Nguyen Phan Duc Khai** - 22120149 - Frontend Developer & API Support - [eNKay2408](https://github.com/eNKay2408)
- **Nguyen Van Khanh** - 22120158 - UI/UX Designer & Backend Developer - [OriginalNVK](https://github.com/OriginalNVK)

## 💻 <a name="technologies">Technologies</a>

<div align="center">
  
  ![Technologies](https://skillicons.dev/icons?i=react,tailwindcss,nodejs,express)

</div>

- **ReactJS:** Build all features through components from the Frontend, using Hooks to interact with the Backend.
- **TailwindCSS:** Design the UI/UX of the application with a modern and responsive design system.
- **NodeJS:** Develop the Backend API to handle requests from the Frontend and interact with the Database.
- **ExpressJS:** Create the server to host the API and route requests to the corresponding endpoints.
- **SQL Server:** Store and manage data of the application, including customer, room, booking, invoice, and report data.

## 🔎 <a name="features">Features</a>

**🔷 Home:** Displays an introduction to the application, including a CTA for room booking and hotel metrics.

**🔷 Booking:** Provides a list of all bookings and the functionality to create a new booking with customer information.

**🔷 Room:** Lists all rooms with the ability to create new ones, update existing ones, and delete them.

**🔷 Invoice:** Presents a list of invoices with the capability to create new ones and view their details.

**🔷 Report:** Visualizes reports on room occupancy and revenue, including a chart and a table.

**🔷 Setting:** Allows users to change some information from room type and customer type.

<img width="49%" src="https://res.cloudinary.com/dvzhmi7a9/image/upload/v1732635266/HotelManagement/ScreenShots/1-BookingList.png"> <img width="49%" src="https://res.cloudinary.com/dvzhmi7a9/image/upload/v1732634836/HotelManagement/ScreenShots/2-BookingDetails.png">

<img width="49%" src="https://res.cloudinary.com/dvzhmi7a9/image/upload/v1732634837/HotelManagement/ScreenShots/3-RoomList.png"> <img width="49%" src="https://res.cloudinary.com/dvzhmi7a9/image/upload/v1732634836/HotelManagement/ScreenShots/4-RoomDetails.png">

<img width="49%" src="https://res.cloudinary.com/dvzhmi7a9/image/upload/v1732634837/HotelManagement/ScreenShots/5-InvoiceList.png"> <img width="49%" src="https://res.cloudinary.com/dvzhmi7a9/image/upload/v1732634838/HotelManagement/ScreenShots/6-InvoiceDetails.png">

<img width="49%" src="https://res.cloudinary.com/dvzhmi7a9/image/upload/v1732634838/HotelManagement/ScreenShots/8-RevenueReport.png"> <img width="49%" src="https://res.cloudinary.com/dvzhmi7a9/image/upload/v1732634838/HotelManagement/ScreenShots/9-OccupancyReport.png">

## ✈️ <a name="development">Development</a>

#### 📌 Note: The application is currently in development and may contain bugs or incomplete features.

### Prerequisites
- [Node.js](https://nodejs.org/en/download/package-manager)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/eNKay2408/Hotel-Management.git
   cd Hotel-Management
   ```

2. Run the SQL script in the `server/src/database` directory to create the database and tables
   - Open SQL Server Management Studio and connect to the server
   - Copy the content of the `hotel_management.sql` file and execute it

3. Install dependencies
    ```bash
    cd client
    npm install

    cd ../server
    npm install
    ```

4. Create a `.env` file in the `server` directory and add the following environment variables
    ```env
    DB_USER=
    DB_PWD=
    DB_NAME=
    DB_SERVER=

    BACKEND_HOSTNAME=
    BACKEND_PORT=

    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    ```
    - `DB_USER`, `DB_PWD`, `DB_NAME`, `DB_SERVER`: SQL Server credentials
    - `BACKEND_HOSTNAME`, `BACKEND_PORT`: Backend server details
    - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary credentials for image upload

5. Run the client and server concurrently
    ```bash
    cd server
    npm run dev
    ```

6. Open the application. The auto-reload feature is enabled for both the client and server
    ```bash
    http://localhost:5173
    ```

## 🌐 <a name="contact">Contact</a>

- **Hoang Tien Huy** - [simpleHuy](https://github.com/simpleHuy)
- **Ma Cat Huynh** - [CatHuyuH24](https://github.com/CatHuyuH24)
- **Nguyen Phan Duc Khai** - [eNKay2408](https://github.com/eNKay2408)
- **Nguyen Van Khanh** - [OriginalNVK](https://github.com/OriginalNVK)
