# 🏢 FranchiseHub - Franchise Marketplace

A comprehensive marketplace platform connecting franchise opportunities with potential investors. Built with React TypeScript frontend and Node.js Express backend.

## 🚀 Features

### For Investors
- **Discover Franchises**: Browse and search through various franchise opportunities
- **Advanced Filtering**: Filter by category, investment range, location, and more
- **Detailed Information**: View comprehensive franchise details, features, and requirements
- **Application System**: Apply directly to franchises with investment proposals
- **Dashboard**: Track application status and manage profile

### For Franchisees
- **List Franchises**: Create detailed franchise opportunity listings
- **Manage Listings**: Edit and update franchise information
- **Review Applications**: View and manage investor applications
- **Analytics Dashboard**: Track listing performance and applicant metrics

### General Features
- **User Authentication**: Secure JWT-based authentication system
- **Role-based Access**: Different interfaces for investors and franchisees
- **Responsive Design**: Modern, mobile-friendly UI
- **Real-time Updates**: Dynamic content updates and notifications
- **Profile Management**: Comprehensive user profile and account settings

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router Dom** for navigation
- **Axios** for API communication
- **Context API** for state management
- **Modern CSS** with responsive design

### Backend
- **Node.js** with Express.js
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **Morgan** for logging
- **CORS** enabled for cross-origin requests

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd franchise-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:3000`

### Manual Setup

If you prefer to set up each part individually:

#### Backend Setup
```bash
cd server
npm install
npm run dev
```

#### Frontend Setup
```bash
cd client
npm install
npm start
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

### API Base URL

The frontend is configured to use `http://localhost:5000/api` as the default API URL. To change this, set the `REACT_APP_API_URL` environment variable in the client.

## 🎯 Usage

### Demo Accounts

The application includes demo data for testing:

**Investor Account:**
- Email: `investor@demo.com`
- Password: `password123`

**Franchisee Account:**
- Email: `franchisee@demo.com`
- Password: `password123`

### User Flows

#### For Investors:
1. Register as an investor or log in
2. Browse franchise opportunities on the home page
3. Use filters to find relevant franchises
4. Click on franchises to view detailed information
5. Submit applications with investment proposals
6. Track application status on the dashboard

#### For Franchisees:
1. Register as a franchisee or log in
2. Create new franchise listings with detailed information
3. Manage existing listings from the dashboard
4. Review and respond to investor applications
5. Update profile and business information

## 📁 Project Structure

```
franchise-marketplace/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript interfaces
│   │   └── App.tsx         # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── data/               # Data storage (in-memory)
│   ├── middleware/         # Custom middleware
│   ├── routes/             # API routes
│   ├── uploads/            # File uploads directory
│   └── index.js            # Server entry point
├── package.json            # Root package.json
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Franchises
- `GET /api/franchises` - Get all franchises (with filters)
- `GET /api/franchises/:id` - Get franchise by ID
- `POST /api/franchises` - Create new franchise (franchisee only)
- `PUT /api/franchises/:id` - Update franchise (owner only)
- `DELETE /api/franchises/:id` - Delete franchise (owner only)
- `GET /api/franchises/my/listings` - Get user's franchises
- `POST /api/franchises/:id/apply` - Apply to franchise
- `GET /api/franchises/:id/applications` - Get franchise applications
- `GET /api/franchises/meta/categories` - Get available categories

### Users
- `GET /api/users/applications` - Get user applications
- `GET /api/users/dashboard` - Get dashboard statistics

## 🎨 Styling

The application uses a modern CSS approach with:
- **CSS Variables** for consistent theming
- **Flexbox & Grid** for layouts
- **Responsive Design** with mobile-first approach
- **Custom Components** styled with utility classes
- **Hover Effects** and smooth transitions

## 🚀 Deployment

### Frontend Deployment
1. Build the React app:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `build` folder to your hosting service

### Backend Deployment
1. Set environment variables for production
2. Deploy to your preferred hosting service (Heroku, AWS, etc.)
3. Ensure the `CLIENT_URL` environment variable points to your frontend URL

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcryptjs
- **Input Validation** on all API endpoints
- **CORS Configuration** for cross-origin requests
- **Helmet.js** for security headers
- **Role-based Access Control** for different user types

## 🔄 Data Storage

Currently uses **in-memory storage** for demonstration purposes. In production, you would replace this with:
- **PostgreSQL** or **MySQL** for relational data
- **MongoDB** for document-based storage
- **Redis** for caching and sessions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the demo application features

## 🔮 Future Enhancements

- **Real Database Integration** (PostgreSQL/MongoDB)
- **File Upload System** for franchise images
- **Payment Integration** for application fees
- **Advanced Search** with Elasticsearch
- **Email Notifications** for application updates
- **Admin Panel** for marketplace management
- **Mobile App** (React Native)
- **Advanced Analytics** and reporting
- **Multi-language Support**
- **Social Login** integration