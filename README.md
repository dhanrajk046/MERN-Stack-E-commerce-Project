<div align="center">

  <img src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png" alt="ShopNest Logo" width="80" />

  <h1>ShopNest - Full-Stack MERN AI E-Commerce Platform</h1>

  <p>
    🚀 A professionally engineered, full-stack e-commerce platform built with
    React.js, Node.js, Express.js, and MongoDB, featuring AI-powered admin tools,
    Stripe payments, dynamic wishlists, category filtering, Cloudinary image
    management, and a complete admin dashboard.
  </p>

  <p>
    <a href="https://shopnest-nqx7.onrender.com">
      🌐 Live Demo
    </a>
  </p>

</div>

---

## 🌐 Live Demo

### 👉 [ShopNest - Live Application](https://shopnest-nqx7.onrender.com)

ShopNest is deployed on **Render** as a single full-stack web service.

The Express.js backend serves:

- REST APIs through `/api/*`
- React production build
- Static frontend assets
- React SPA routes

---

## 📸 Screenshots

### 🏠 Home / Product Interface

<img width="1366" height="768" alt="ShopNest Home Page" src="https://github.com/user-attachments/assets/bc11952b-abf4-4c73-86c9-aba50abaae83" />

### 🛍️ Product / Shopping Interface

<img width="1351" height="768" alt="ShopNest Product Interface" src="https://github.com/user-attachments/assets/39a683d9-87d0-4edc-999d-439ad9a42e02" />

### 📊 Admin / Application Interface

<img width="1356" height="768" alt="ShopNest Admin Interface" src="https://github.com/user-attachments/assets/a19a09d4-92d9-43f6-afcd-3b88df37280d" />

---

# 🚀 About ShopNest

**ShopNest** is a full-stack MERN e-commerce application designed to simulate
a modern production-style online shopping platform.

The project goes beyond basic CRUD functionality by combining:

- User authentication
- Product management
- Shopping cart
- Wishlist
- Dynamic category filtering
- Order management
- Stripe payment processing
- Cloudinary image management
- Admin dashboard
- AI-powered product description generation
- AI-powered review summarization
- Review sentiment analysis
- RESTful APIs
- Postman API testing
- Production deployment

---

# ✨ Key Features

## 👤 User Features

- 🔐 JWT-based authentication
- 👤 User registration and login
- 🛍️ Product browsing
- 🔎 Product search
- 🗂️ Dynamic category filtering
- ❤️ Wishlist functionality
- 🛒 Shopping cart
- 💳 Secure Stripe checkout
- 📦 Order placement
- 📋 Order history
- 👤 User profile
- ⭐ Product reviews and ratings

---

# 🛠️ Admin Dashboard

ShopNest includes a dedicated admin dashboard for managing the e-commerce platform.

### Admin capabilities include:

- 📦 Product management
- ➕ Add products
- ✏️ Update products
- 🗑️ Delete products
- 🗂️ Category management
- 👥 User management
- 📋 Order management
- ⭐ Review management
- 🖼️ Cloudinary-based product image uploads
- 🤖 AI-powered product description generation
- 🤖 AI-powered review summarization
- 📊 Review sentiment analysis

---

# 🤖 AI Features

ShopNest integrates **Grok AI** into the administrative workflow.

## ✍️ AI Product Description Generation

Administrators can generate product descriptions using AI, reducing the amount of manual content creation required when adding products.

## 📝 AI Review Summarization

The system can summarize multiple customer reviews into a concise overview.

## 📊 Review Sentiment Analysis

Customer reviews can be analyzed to determine their general sentiment, helping administrators understand customer feedback more efficiently.

---

# 💳 Stripe Payment Integration

ShopNest integrates **Stripe** for secure online payment processing.

The payment workflow supports:

- Creating Stripe Checkout Sessions
- Redirecting customers to Stripe Checkout
- Secure payment processing
- Payment success handling
- Payment cancellation handling
- Order creation after successful payment

### Payment Flow

```text
Customer
   │
   ▼
Shopping Cart
   │
   ▼
Checkout
   │
   ▼
Backend API
   │
   ▼
Stripe Checkout Session
   │
   ▼
Stripe Payment Page
   │
   ├───────────────┐
   │               │
   ▼               ▼
Success          Cancel
   │               │
   ▼               ▼
Order Created   Return to App

⚠️ Never commit Stripe secret keys to GitHub.
Use Stripe test keys during development and store all credentials in environment variables.

☁️ Cloudinary Integration

ShopNest uses Cloudinary for product image storage and management.

Features
Cloud-based image storage
Secure image uploads
Optimized media delivery
Product image management
Reduced dependency on local filesystem storage
🛠️ Tech Stack
Frontend
React.js
React Router
Redux Toolkit
Context API
JavaScript
HTML5
CSS3
Backend
Node.js
Express.js
RESTful APIs
Middleware-based architecture
JWT Authentication
Database
MongoDB
Mongoose
AI
Grok AI
Payments
Stripe
Cloud Storage
Cloudinary
Multer
Development & Testing
Git
GitHub
Postman
npm
Deployment
Render
🏗️ Application Architecture
                         ┌──────────────────────┐
                         │       Browser        │
                         │      React SPA       │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP / REST API
                                    ▼
                         ┌──────────────────────┐
                         │    Express Server    │
                         │       Node.js        │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
             ┌────────────┐  ┌────────────┐  ┌─────────────┐
             │  MongoDB   │  │ Cloudinary │  │    Stripe   │
             │  Database  │  │   Images   │  │   Payments  │
             └────────────┘  └────────────┘  └─────────────┘
                                    │
                                    ▼
                              ┌────────────┐
                              │  Grok AI   │
                              │ AI Features│
                              └────────────┘
📁 Project Structure
ShopNest/
│
├── backend/
│   ├── Controllers/
│   ├── Middleware/
│   ├── Models/
│   ├── Routes/
│   ├── Utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── redux/
│   │   └── App.js
│   └── package.json
│
├── scripts/
│
├── .gitignore
├── LICENSE
├── package.json
├── package-lock.json
├── render.yaml
└── README.md
🚀 Local Development
1️⃣ Clone the Repository
git clone https://github.com/dhanrajk046/MERN-Stack-E-commerce-Project.git
cd MERN-Stack-E-commerce-Project
2️⃣ Install Dependencies

Install root dependencies:

npm install

Install backend dependencies:

cd backend
npm install

Install frontend dependencies:

cd ../frontend
npm install

Return to the root:

cd ..
🔐 Environment Variables

Create a .env file inside the backend/ directory.

Example:

PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/shopnest

JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GROK_API_KEY=your_grok_api_key

⚠️ Do not commit .env files or API credentials to GitHub.

🗄️ MongoDB Setup

Make sure MongoDB is running locally.

Default local database:

mongodb://127.0.0.1:27017/shopnest

You can also use MongoDB Atlas.

Example:

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shopnest
🌱 Database Seeding

The project includes database seeding functionality for quickly populating the application with sample data.

Run:

npm run seed
Demo Admin Account
Email: admin@shopnest.com
Password: password123

⚠️ This account is intended only for local/demo usage.
Change the credentials before using the application in a real production environment.

▶️ Run the Application

From the root directory:

npm run dev

This starts:

Frontend → http://localhost:3000
Backend  → http://localhost:5000
🏭 Production Build

Create the React production build:

npm run build

When running in production mode, the Express backend serves the generated React build.

☁️ Deployment on Render

ShopNest is configured to run as a single full-stack Render Web Service.

A separate frontend Render service is not required.

Deployment Architecture
                    Render
                       │
                       ▼
              ┌──────────────────┐
              │ ShopNest Web     │
              │ Service          │
              └────────┬─────────┘
                       │
                 Express :PORT
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
          /api/*             React SPA
             │                   │
             ▼                   ▼
          MongoDB          frontend/build
🚀 Render Deployment Steps
1️⃣ Push to GitHub
git add .
git commit -m "Prepare ShopNest for production"
git push origin main
2️⃣ Create a Render Web Service

Open the Render Dashboard:

https://dashboard.render.com

Create:

New → Web Service

Connect the GitHub repository.

3️⃣ Build Command

Use:

npm run render-build

This prepares the backend and frontend for production.

4️⃣ Start Command

Use:

npm start
5️⃣ Configure Environment Variables

Add the production environment variables in the Render dashboard.

Example:

NODE_ENV=production

MONGO_URI=your_production_mongodb_uri

JWT_SECRET=your_production_jwt_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GROK_API_KEY=your_grok_api_key
🔒 Security

For production usage:

Never expose .env files.
Never commit API keys.
Never expose Stripe secret keys.
Use strong JWT secrets.
Use separate development and production databases.
Change default admin credentials.
Protect admin routes with authorization.
Use Stripe test keys during development.
Use Stripe production keys only when the application is ready for live payments.
Keep dependencies updated.
📮 Postman API Collection

The repository includes a Postman collection:

ShopNest - MERN.postman_collection.json

Import the collection into Postman to test the backend APIs.

The collection can be used to test:

Authentication
Products
Categories
Users
Cart
Wishlist
Orders
Stripe payment APIs
Reviews
Admin APIs

Protected endpoints can be tested using the authentication token.

🔑 API Architecture

The backend follows a RESTful API architecture.

/api
   │
   ├── auth
   │
   ├── products
   │
   ├── categories
   │
   ├── users
   │
   ├── cart
   │
   ├── wishlist
   │
   ├── orders
   │
   ├── payments
   │
   ├── reviews
   │
   └── admin
🧪 Development Workflow
Development
     │
     ▼
Local Testing
     │
     ▼
API Testing with Postman
     │
     ▼
Git Commit
     │
     ▼
GitHub
     │
     ▼
Render Deployment
     │
     ▼
Production Testing
📈 What I Learned

Building ShopNest strengthened my practical understanding of:

Full-stack MERN architecture
React application development
Redux state management
REST API design
JWT authentication
Authorization and middleware
MongoDB database design
Mongoose
Stripe payment integration
Cloudinary integration
AI API integration
Admin dashboard architecture
API testing with Postman
Git and GitHub
Render deployment
Environment variable management
Production debugging
Full-stack application deployment
🔮 Future Improvements

Potential future improvements include:

🤖 AI-powered personalized product recommendations
📊 Advanced admin analytics
⚡ Redis caching
🔎 Advanced product search
📧 Automated email notifications
📦 Real-time order tracking
🧠 AI-powered recommendation engine
⚙️ Performance optimization
🔄 Automated CI/CD pipeline
👨‍💻 Developer

Dhanraj Kumar

Software Engineer | Full-Stack Developer

Technologies
React.js
Node.js
Express.js
MongoDB
JavaScript
Python
Django
REST APIs
Git
GitHub
AI/ML
Cloud Technologies
📌 Project Links

🌐 Live Application

https://shopnest-nqx7.onrender.com

💻 GitHub Repository

https://github.com/dhanrajk046/MERN-Stack-E-commerce-Project

📄 License

This project is licensed under the Apache License 2.0.

See the LICENSE file for more information.

<div align="center">
⭐ If you find this project interesting, consider giving it a star!

Built with ❤️ using the MERN Stack + AI

</div> ```
