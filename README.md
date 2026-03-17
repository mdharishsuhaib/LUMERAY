# LUMERAY – Smart Expense Tracker

LUMERAY is a full-stack smart expense tracking web application that helps users manage their personal expenses, track spending, and visualize financial habits through a clean and modern dashboard.

The project demonstrates secure authentication, REST API development, database integration, and a modern React UI.




**🌐 Live Demo**

👉 **Frontend:**
https://lumeray-app.netlify.app/

👉 **Backend:**
https://lumeray.onrender.com




**🚀 Features**

User Registration and Login

Secure Password Hashing using **bcrypt**

JWT-based Authentication

Expense Dashboard Interface

Modern UI built with Tailwind CSS

RESTful API architecture

MySQL database integration

Responsive design




**🛠 Tech Stack**

**Frontend**

React

TypeScript

Tailwind CSS

Axios

Vite


**Backend**

Node.js

Express.js

bcrypt

jsonwebtoken


**Database**

MySQL




**📂 Project Structure**
LUMERAY
│
├── backend
│   ├── routes
│   │   └── auth.js
│   ├── db.js
│   ├── server.js
│   └── package.json
│
├── src
│   ├── pages
│   ├── components
│   ├── context
│   └── App.tsx
│
├── public
├── package.json
└── README.md




**⚙️ Installation & Setup**

Follow these steps to run the project locally.


**1️⃣ Clone the Repository**

git clone 

https://github.com/mdharishsuhaib/LUMERAY.git

cd LUMERAY


**2️⃣ Install Frontend Dependencies**

npm install


**3️⃣ Install Backend Dependencies**

Navigate to backend folder:

cd backend

Install packages:

npm install


**4️⃣ Setup MySQL Database**

👉 **If using Local MySQL**

Open MySQL and run:

CREATE DATABASE lumeray;

USE lumeray;

Create the users table:

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);


**5️⃣ Setup Environment Variables**

Inside the **backend folder**, create a file:

.env

Add the following variables:

PORT=5000

**MySQL DB (Local)**

DB_HOST=your_host

DB_USER=your_username

DB_PASSWORD=your_password

DB_NAME=lumeray

**JWT Authentication**

JWT_SECRET=your_secret_key


**6️⃣ Run the Backend Server**

Inside backend folder:

node server.js

Backend will run on:

http://localhost:5000


**7️⃣ Run the Frontend**

Go back to the root folder:

cd ..

Start the frontend server:

npm run dev

Frontend will run on:

http://localhost:5173




**🔐 Authentication Flow**

User registers a new account.

Password is securely hashed using **bcrypt**.

User logs in with credentials.

Backend generates a **JWT token**.

Frontend stores the token for authenticated requests.




**📊 Future Improvements**

Smart financial insights

AI-based spending recommendations




**👨‍💻 Author:**
**MOHAMMED HARIS SUHAIB M**




**GitHub:**
https://github.com/mdharishsuhaib




**⭐ Show Your Support:**
If you like this project, please consider giving it a star on GitHub ⭐
