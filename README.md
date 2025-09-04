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
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Overview

Delivista is a comprehensive food ordering platform backend that handles user authentication, restaurant management, menu operations, cart functionality, order processing, and payment integration. The server is designed with a modular architecture for scalability and maintainability.

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login with email verification
- JWT-based authentication with refresh tokens
- Role-based access control (Customer, Seller, Admin)
- Password encryption with bcrypt
- OTP generation and verification
- Secure cookie-based session management

### 🏪 Restaurant Management
- Restaurant registration and profile management
- Multi-cuisine support with detailed categorization
- Operating hours and availability management
- Restaurant verification system
- Rating and review system

### 🍽️ Menu Management
- Comprehensive menu item creation with 18+ categories
- Advanced food categorization (Veg/Non-Veg, dietary preferences)
- Rich food tags system (Spicy, Sweet, Healthy, etc.)
- Image management for food items
- Availability and recommendation system

### 🛒 Shopping Experience
- Advanced cart management with restaurant-specific items
- Wishlist functionality for favorite items
- Multiple address management for delivery
- Real-time cart updates and pricing

### 💳 Payment & Orders
- Stripe payment integration with secure processing
- Comprehensive order management system
- Order status tracking (placed, confirmed, delivered, cancelled)
- Payment status monitoring (pending, success, failed)
- Transaction ID tracking

### 📧 Communication
- Email notifications using Nodemailer
- Order confirmation and status update emails
- Password reset and account verification
- SMTP-based email delivery system

### 🖼️ File Management
- Cloudinary integration for optimized image uploads
- Profile picture and restaurant image management
- Automatic image compression and CDN delivery
- Multiple format support with security validation

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript 5.8.3
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 8.15.1
- **Authentication**: JWT (JSON Web Tokens) 9.0.2

### Security & Middleware
- **Security**: Helmet.js 8.1.0, CORS 2.8.5
- **Rate Limiting**: Express Rate Limit 7.5.0
- **File Upload**: Multer 2.0.0
- **Cookie Management**: Cookie Parser 1.4.7
- **Validation**: Custom validation middleware

### External Services
- **Cloud Storage**: Cloudinary 2.6.1
- **Payment Gateway**: Stripe 18.4.0
- **Email Service**: Nodemailer 7.0.3
- **Password Hashing**: bcrypt 6.0.0
- **OTP Generation**: OTP Generator 4.0.1

### Development Tools
- **TypeScript Compiler**: tsc
- **Development Server**: ts-node-dev 2.0.0
- **Environment Management**: dotenv 16.5.0
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
- `POST /register` - User registration with email verification
- `POST /login` - User login with JWT tokens
- `POST /logout` - User logout and token invalidation
- `POST /verify-email` - Email verification with OTP
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset with token validation

### User Routes (`/app/user`)
- `GET /profile` - Get authenticated user profile
- `PUT /profile` - Update user profile information
- `DELETE /profile` - Delete user account permanently

### Restaurant Routes (`/app/restaurant`)
- `POST /register` - Restaurant registration by sellers
- `GET /` - Get all restaurants with filtering
- `GET /:id` - Get restaurant details by ID
- `PUT /:id` - Update restaurant information
- `DELETE /:id` - Delete restaurant (admin/seller only)

### Menu Routes (`/app/menu`)
- `POST /` - Create new menu item
- `GET /` - Get menu items with category filtering
- `GET /:id` - Get specific menu item details
- `PUT /:id` - Update menu item information
- `DELETE /:id` - Delete menu item

### Cart Routes (`/app/cart`)
- `POST /add` - Add item to user's cart
- `GET /` - Get user's cart items
- `PUT /:id` - Update cart item quantity
- `DELETE /:id` - Remove item from cart
- `DELETE /clear` - Clear entire cart

### Payment Routes (`/app/pyment`)
- `POST /create-payment-intent` - Create Stripe payment intent
- `POST /confirm-payment` - Confirm payment and create order
- `GET /orders` - Get user's order history
- `GET /orders/:id` - Get specific order details
- `PUT /orders/:id/status` - Update order status

### Address Routes (`/app/address`)
- `POST /` - Add new delivery address
- `GET /` - Get user's saved addresses
- `PUT /:id` - Update address information
- `DELETE /:id` - Delete saved address

### Wishlist Routes (`/app/wishlist`)
- `POST /add` - Add menu item to wishlist
- `GET /` - Get user's wishlist items
- `DELETE /:id` - Remove item from wishlist

### Admin Routes (`/app/admin`)
- `GET /users` - Get all users (admin only)
- `GET /restaurants` - Get all restaurants for admin
- `PUT /restaurants/:id/verify` - Verify restaurant (admin only)
- `DELETE /users/:id` - Delete user account (admin only)

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
- **Basic Info**: name, email, phone, address
- **Authentication**: password (bcrypt hashed), role (customer/seller/admin)
- **Profile**: avatar URL with default placeholder
- **Timestamps**: createdAt, updatedAt

### Restaurant Model
- **Details**: name, phone, address, pinCode
- **Cuisine**: array of cuisine types
- **Media**: image URL for restaurant photo
- **Operations**: isOpen, openTime, closeTime
- **Verification**: isVerified status
- **Ratings**: ratings (0.0-5.0), totalReviews count
- **Relations**: sellerId reference

### Menu Model
- **Product Info**: productName, description, price
- **Categorization**: category (18+ options), isVeg boolean
- **Media**: image URL for food photo
- **Availability**: isAvailable, isRecommended
- **Tags**: array of food tags (Spicy, Sweet, Healthy, etc.)
- **Performance**: ratings, totalReviews, totalOrders
- **Relations**: restaurantId, sellerId, customerId references

### Order Model
- **Customer Info**: customerId, sellerId, sessionId
- **Address**: addressId, fullName, address, city, phoneNumber, addressType
- **Items**: array of menu items with quantity, price, and details
- **Pricing**: totalAmount
- **Status**: paymentStatus (pending/success/failed), orderStatus (placed/confirmed/delivered/cancelled)
- **Transaction**: transactionId for payment tracking

### Cart Model
- **User Relations**: sellerId, customerId, restaurantId
- **Items**: array of cart items with menuId, quantity, price, productName, category, isVeg
- **Pricing**: totalPrice calculation
- **Status**: orderStatus (pending/in-progress/completed)

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
- Configure production MongoDB connection
- Set up production environment variables
- Configure CORS for production frontend URL
- Ensure all external service credentials are production-ready

### Deployment Options
- **Vercel**: Serverless deployment with automatic builds
- **Railway**: Easy deployment with MongoDB Atlas integration
- **Heroku**: Traditional hosting with add-ons
- **DigitalOcean**: VPS deployment with Docker support
- **AWS**: Scalable cloud deployment with EC2/ECS
- **Render**: Modern cloud platform with automatic deployments

### Production Checklist
- [ ] Environment variables configured
- [ ] MongoDB Atlas cluster set up
- [ ] Cloudinary account configured
- [ ] Stripe keys updated for production
- [ ] Email service configured
- [ ] CORS origins updated
- [ ] Rate limiting enabled
- [ ] Error logging configured

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/app
Production: https://your-domain.com/app
```

### Authentication
All protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Response Format
All API responses follow a consistent format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "error": null
}
```

### Error Handling
The API uses HTTP status codes and structured error responses:
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

### Rate Limiting
- 100 requests per 15 minutes per IP address
- Rate limit headers included in responses
- Exceeded limits return 429 status code

### File Upload
- Maximum file size: 10MB
- Supported formats: JPG, PNG, GIF, WebP
- Images automatically optimized via Cloudinary

## 🤝 Contributing

We welcome contributions to Delivista! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request** with a detailed description

### Development Guidelines
- **TypeScript**: Follow TypeScript best practices and strict typing
- **Code Style**: Maintain consistent formatting and naming conventions
- **Error Handling**: Add comprehensive error handling and validation
- **Documentation**: Update documentation for new features
- **Testing**: Include tests for new functionality
- **Security**: Follow security best practices for authentication and data handling
- **Performance**: Consider performance implications of changes

### Code Review Process
- All PRs require review before merging
- Ensure all tests pass
- Follow the existing code structure and patterns
- Include proper error messages and logging

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Javid Shabin** - [GitHub Profile](https://github.com/javidshabin)

## 🙏 Acknowledgments

- **Inspiration**: Inspired by Zomato and Swiggy's user experience
- **Technologies**: Built with modern web technologies and best practices
- **Community**: Open source community contributions and feedback
- **Design**: Focus on scalability, performance, and user experience

## 🔗 Related Projects

- **Frontend**: [Delivista Customer App](https://delivista-customer-page.vercel.app)
- **Admin Panel**: Coming soon
- **Mobile App**: Planned for future development

## 📞 Support

For support, email support@delivista.com or create an issue in this repository.

---

**Delivista** - Bringing delicious food to your doorstep with cutting-edge technology! 🍕🚀

*Built with ❤️ by the Delivista team*
