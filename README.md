# 🍕 Delivista - Food Ordering Server

A robust, scalable backend server for a food ordering platform inspired by Zomato and Swiggy. Built with Node.js, TypeScript, Express.js, and MongoDB.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Authentication & Security](#authentication--security)
- [File Upload](#file-upload)
- [Payment Integration](#payment-integration)
- [Email Services](#email-services)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Overview

Delivista is a comprehensive food ordering platform backend that handles user authentication, restaurant management, menu operations, cart functionality, order processing, and payment integration. The server is designed with a modular architecture for scalability and maintainability.

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login with email verification
- JWT-based authentication with refresh tokens
- Role-based access control (User, Seller, Admin)
- Password encryption with bcrypt
- OTP generation and verification

### 🏪 Restaurant Management
- Restaurant registration and profile management
- Menu creation and management
- Category-based food organization
- Restaurant search and filtering

### 🛒 Shopping Experience
- Add/remove items from cart
- Wishlist functionality
- Address management for delivery
- Order tracking and status updates

### 💳 Payment & Orders
- Stripe payment integration
- Order processing and management
- Order status tracking (placed, confirmed, delivered, cancelled)
- Payment validation and security

### 📧 Communication
- Email notifications using Nodemailer
- Order confirmation emails
- Password reset functionality

### 🖼️ File Management
- Cloudinary integration for image uploads
- Profile picture management
- Restaurant and food image handling

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

### Security & Middleware
- **Security**: Helmet.js, CORS
- **Rate Limiting**: Express Rate Limit
- **File Upload**: Multer
- **Validation**: Custom validation middleware

### External Services
- **Cloud Storage**: Cloudinary
- **Payment Gateway**: Stripe
- **Email Service**: Nodemailer
- **Password Hashing**: bcrypt

### Development Tools
- **TypeScript Compiler**: tsc
- **Development Server**: ts-node-dev
- **Code Quality**: ESLint (recommended)

## 📁 Project Structure

```
src/
├── app.ts                          # Main application setup
├── server.ts                       # Server entry point
├── configs/                        # Configuration files
│   ├── cloudinary.ts              # Cloudinary configuration
│   ├── connectDb.ts               # MongoDB connection
│   ├── stripe.ts                  # Stripe configuration
│   └── transportMail.ts           # Email transport setup
├── middlewares/                    # Custom middleware
│   ├── auth.middleware.ts         # Authentication middleware
│   ├── authorize.ts               # Role-based authorization
│   ├── errorHandler.ts            # Global error handling
│   └── multer.ts                  # File upload middleware
├── modules/                        # Feature modules
│   ├── address/                   # Address management
│   ├── admin/                     # Admin operations
│   ├── authentication/            # User authentication
│   ├── cart/                      # Shopping cart
│   ├── menu/                      # Menu management
│   ├── order/                     # Order processing
│   ├── payment/                   # Payment handling
│   ├── profiles/                  # User profiles
│   ├── restaurant/                # Restaurant management
│   ├── seller/                    # Seller operations
│   ├── user/                      # User operations
│   └── wishlist/                  # Wishlist functionality
├── shared/                        # Shared utilities
│   ├── cloudinary/                # Cloudinary upload utilities
│   ├── email/                     # Email sending utilities
│   └── token/                     # Token generation utilities
└── utils/                         # Utility functions
    ├── appError.ts                # Custom error classes
    └── generateToken.ts           # Token generation helpers
```

## 🌐 API Endpoints

### Authentication Routes (`/app/authentication`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /verify-email` - Email verification
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset

### User Routes (`/app/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `DELETE /profile` - Delete user account

### Restaurant Routes (`/app/restaurant`)
- `POST /register` - Restaurant registration
- `GET /` - Get all restaurants
- `GET /:id` - Get restaurant by ID
- `PUT /:id` - Update restaurant
- `DELETE /:id` - Delete restaurant

### Menu Routes (`/app/menu`)
- `POST /` - Create menu item
- `GET /` - Get menu items
- `GET /:id` - Get menu item by ID
- `PUT /:id` - Update menu item
- `DELETE /:id` - Delete menu item

### Cart Routes (`/app/cart`)
- `POST /add` - Add item to cart
- `GET /` - Get cart items
- `PUT /:id` - Update cart item
- `DELETE /:id` - Remove item from cart

### Payment Routes (`/app/pyment`)
- `POST /create-payment-intent` - Create Stripe payment intent
- `POST /confirm-payment` - Confirm payment
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order by ID

### Address Routes (`/app/address`)
- `POST /` - Add new address
- `GET /` - Get user addresses
- `PUT /:id` - Update address
- `DELETE /:id` - Delete address

### Wishlist Routes (`/app/wishlist`)
- `POST /add` - Add item to wishlist
- `GET /` - Get wishlist items
- `DELETE /:id` - Remove item from wishlist

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd delivista-server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/delivista

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for CORS)
FRONTEND_URL=https://delivista-customer-page.vercel.app
```

### 4. Database Setup
Ensure MongoDB is running and accessible. The application will automatically create the database and collections on first run.

### 5. Run the Application

#### Development Mode
```bash
npm run dev
```

#### Production Build
```bash
npm run build
npm start
```

## 🔒 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | Yes | 5000 |
| `NODE_ENV` | Environment mode | No | development |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRES_IN` | JWT expiration time | No | 7d |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | - |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes | - |
| `EMAIL_HOST` | SMTP host | Yes | - |
| `EMAIL_USER` | SMTP username | Yes | - |
| `EMAIL_PASS` | SMTP password | Yes | - |

## 🗄️ Database Schema

### User Model
- Basic info (name, email, phone)
- Authentication (password, refresh tokens)
- Role-based access control
- Profile information

### Restaurant Model
- Restaurant details (name, description, cuisine)
- Location and contact information
- Operating hours and status
- Owner information

### Menu Model
- Food item details (name, description, price)
- Category and dietary information
- Image URLs and availability status
- Restaurant reference

### Order Model
- Order details and items
- Customer and restaurant information
- Payment status and order status
- Delivery address and tracking

### Cart Model
- User cart items
- Quantity and pricing
- Restaurant association

## 🔐 Authentication & Security

### JWT Implementation
- Access tokens for API requests
- Refresh tokens for token renewal
- Secure token storage in HTTP-only cookies

### Password Security
- bcrypt hashing with salt rounds
- Secure password validation
- Password strength requirements

### Role-Based Access Control
- User: Basic operations and ordering
- Seller: Restaurant and menu management
- Admin: System-wide administration

### Security Middleware
- Helmet.js for security headers
- CORS configuration for frontend access
- Rate limiting for API protection
- Input validation and sanitization

## 📁 File Upload

### Cloudinary Integration
- Automatic image optimization
- Multiple format support
- Secure file storage
- CDN delivery for fast loading

### Upload Features
- Profile picture uploads
- Restaurant and food images
- File size and type validation
- Automatic image compression

## 💳 Payment Integration

### Stripe Payment Gateway
- Secure payment processing
- Multiple payment methods
- Webhook handling for payment events
- Payment intent creation and confirmation

### Order Processing
- Payment validation
- Order confirmation
- Status tracking
- Error handling and rollback

## 📧 Email Services

### Nodemailer Configuration
- SMTP-based email delivery
- HTML email templates
- Transactional email support
- Email queue management

### Email Types
- Welcome and verification emails
- Order confirmation notifications
- Password reset instructions
- Account updates

## 🛠️ Development

### Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Modular architecture for maintainability

### Testing
- Unit testing setup (recommended)
- Integration testing (recommended)
- API endpoint testing (recommended)

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production MongoDB
- Set up production environment variables
- Configure CORS for production frontend

### Deployment Options
- **Vercel**: Serverless deployment
- **Railway**: Easy deployment with MongoDB
- **Heroku**: Traditional hosting
- **DigitalOcean**: VPS deployment
- **AWS**: Scalable cloud deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code style
- Add proper error handling
- Include input validation
- Write meaningful commit messages

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Javid Shabin** - [GitHub Profile](https://github.com/javidshabin)

## 🙏 Acknowledgments

- Inspired by Zomato and Swiggy
- Built with modern web technologies
- Designed for scalability and performance
- Community-driven development approach

---

**Delivista** - Bringing delicious food to your doorstep with technology! 🍕🚀
