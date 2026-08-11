<div align="center">

  <img src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png" alt="ShopNest Logo" width="80" />

  <h1>ShopNest - Full-Stack MERN AI E-Commerce Platform</h1>

  <p>
    🚀 A professionally engineered, full-stack e-commerce platform built with
    React.js, Node.js, Express.js, and MongoDB, featuring AI-powered admin tools,
    Razorpay payments, dynamic wishlists, category filtering, Cloudinary image
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

The application is deployed on **Render** as a single full-stack service.

The Express.js backend serves:

- REST APIs through `/api/*`
- React production build
- Static frontend assets
- Client-side React routes

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

**ShopNest** is a full-stack MERN e-commerce application designed to simulate a modern production-style online shopping platform.

The project focuses on building a complete e-commerce ecosystem rather than only implementing a product listing interface.

It includes:

- User authentication
- Product browsing
- Shopping cart
- Wishlist
- Category filtering
- Order management
- User profiles
- Admin dashboard
- Product management
- Cloudinary image uploads
- Razorpay payment integration
- AI-powered product description generation
- AI-powered review summarization
- Review sentiment analysis
- RESTful APIs
- Postman API documentation
- Production deployment on Render

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
- 📦 Order placement
- 📋 Order history
- 👤 User profile
- ⭐ Product reviews and ratings

---

## 🛠️ Admin Dashboard

ShopNest includes a dedicated administration system for managing the platform.

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

ShopNest integrates AI into the administrative workflow to automate repetitive tasks and provide useful insights.

### AI-powered Product Description Generation

Administrators can generate product descriptions using AI instead of manually writing descriptions for every product.

### AI Review Summarization

The system can summarize multiple customer reviews into a concise overview.

### AI Sentiment Analysis

Customer reviews can be analyzed to determine their general sentiment, helping administrators understand customer feedback more efficiently.

---

# 💳 Payment Integration

ShopNest integrates **Razorpay** for payment processing.

The payment workflow is designed to support:

- Payment order creation
- Payment processing
- Payment verification
- Order creation after successful payment

> ⚠️ For local development, use your own Razorpay test credentials. Never commit real payment credentials to GitHub.

---

# ☁️ Cloudinary Integration

Product images are uploaded and managed using **Cloudinary**.

The backend uses secure server-side handling for image uploads.

### Benefits:

- Cloud-based image storage
- Optimized media delivery
- Secure upload handling
- Reduced dependency on local storage

---

# 🛠️ Tech Stack

## Frontend

- React.js
- React Router
- Redux Toolkit
- Context API
- JavaScript
- HTML5
- CSS3

## Backend

- Node.js
- Express.js
- RESTful APIs
- Middleware-based architecture
- JWT Authentication

## Database

- MongoDB
- Mongoose

## AI

- Grok AI

## Payments

- Razorpay

## Cloud Storage

- Cloudinary
- Multer

## Development & Testing

- Git
- GitHub
- Postman
- npm

## Deployment

- Render

---

# 🏗️ Application Architecture

```text
                         ┌──────────────────────┐
                         │       Browser        │
                         │      React SPA       │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP / REST API
                                    ▼
                         ┌──────────────────────┐
                         │    Express Server    │
                         │      Node.js         │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
             ┌────────────┐  ┌────────────┐  ┌─────────────┐
             │  MongoDB   │  │ Cloudinary │  │  Razorpay   │
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

Install the root dependencies:

npm install

Then install backend dependencies:

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

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GROK_API_KEY=your_grok_api_key

⚠️ Never commit .env files or real API credentials to GitHub.

🗄️ MongoDB Setup

Make sure MongoDB is running locally.

The default local database configuration is:

mongodb://127.0.0.1:27017/shopnest

You can also use a MongoDB Atlas connection string.

Example:

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shopnest
🌱 Database Seeding

The project includes database seeding functionality for quickly populating the application with sample data.

Run:

npm run seed

The seed process can create sample products and an administrator account.

Demo Admin Account
Email: admin@shopnest.com
Password: password123

⚠️ This credential is intended only for local/demo usage. Change or remove it before using the application in a real production environment.

▶️ Run the Application

The project uses concurrently to simplify local development.

From the root directory:

npm run dev

This starts:

Frontend → http://localhost:3000
Backend  → http://localhost:5000
🏭 Production Build

Create the React production build with:

npm run build

The generated frontend build is then served by the Express backend when running in production mode.

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
1️⃣ Push the Project to GitHub
git add .
git commit -m "Prepare ShopNest for production"
git push origin main
2️⃣ Create a Render Web Service

Open the Render Dashboard:

https://dashboard.render.com

Create a new:

Web Service

Connect the GitHub repository.

3️⃣ Configure Build Command

Use:

npm run render-build

This installs the required dependencies and generates the React production build.

4️⃣ Configure Start Command

Use:

npm start
5️⃣ Configure Environment Variables

Add the required production environment variables in:

Render Dashboard
        ↓
Environment
        ↓
Environment Variables

Example:

NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GROK_API_KEY=your_grok_api_key
🔒 Security Notes

For production usage:

Never expose .env files.
Never commit API keys.
Use strong JWT secrets.
Use Razorpay production credentials only when ready.
Use separate development and production databases.
Change default admin credentials.
Restrict admin routes with proper authorization.
Keep dependencies updated.
📮 Postman API Collection

The repository includes:

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
Payments
Reviews
Admin APIs

Protected APIs can be tested using the authentication token.

🔑 API Architecture

The backend follows a RESTful API architecture.

Example structure:

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

The project was developed using a modern Git-based workflow.

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

Building ShopNest helped strengthen my practical understanding of:

Full-stack MERN architecture
React application development
Redux state management
REST API design
JWT authentication
Authorization and middleware
MongoDB database design
Mongoose
Payment gateway integration
Cloudinary integration
AI API integration
Admin dashboard architecture
API testing with Postman
Git and GitHub
Production deployment
Environment variable management
Debugging production issues
🔮 Future Improvements

Potential future improvements include:

Advanced product recommendation system
AI-powered personalized shopping
Advanced analytics dashboard
Redis caching
Improved search with filters
Product recommendation engine
Automated email notifications
Order tracking integration
Performance optimization
Automated CI/CD pipeline
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
