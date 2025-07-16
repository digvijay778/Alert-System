# 🚨 Alert System

A real-time emergency alert system built with React, Node.js, and Socket.io. This system allows users to send emergency alerts with location information and provides real-time notifications to administrators.

## 🌟 Features

### 🔥 Core Features
- **Emergency Alert System**: Users can send emergency alerts with location data
- **Real-time Notifications**: Instant alerts via Socket.io
- **Location Services**: Automatic geolocation detection
- **Multi-channel Notifications**: Email and SMS notifications via Twilio
- **Admin Dashboard**: Administrative interface for managing alerts
- **User Authentication**: JWT-based authentication system
- **Offline Support**: Service worker for offline functionality

### 🛡️ Security Features
- **Rate Limiting**: Prevents brute-force attacks
- **CORS Protection**: Secure cross-origin resource sharing
- **Input Validation**: Comprehensive data validation
- **Secure Headers**: Helmet.js for security headers
- **JWT Authentication**: Secure token-based authentication

### 📱 Frontend Features
- **Responsive Design**: Mobile-first responsive interface
- **React Router**: Client-side routing
- **Context API**: State management
- **Axios Integration**: HTTP client with interceptors
- **PWA Support**: Progressive Web App capabilities

## 🏗️ Architecture

### Backend
- **Node.js + Express**: RESTful API server
- **MongoDB**: Database for storing alerts and users
- **Socket.io**: Real-time communication
- **JWT**: Authentication and authorization
- **Nodemailer**: Email notifications
- **Twilio**: SMS notifications

### Frontend
- **React 19**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **React Router**: Navigation and routing
- **Leaflet**: Interactive maps
- **Tailwind CSS**: Utility-first CSS framework

## 🚀 Live Demo

- **Frontend**: https://frontend-mk40egi6w-digvijay778s-projects.vercel.app
- **Backend**: https://backend-b5o47ohiy-digvijay778s-projects.vercel.app

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Twilio account (for SMS)
- Email service (Gmail/Ethereal)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/digvijay778/Alert-System.git
   cd Alert-System/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:5173

   # MongoDB Connection
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/alertsystem

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=30d

   # Email Configuration
   EMAIL_HOST=smtp.ethereal.email
   EMAIL_PORT=587
   EMAIL_USER=your_email@ethereal.email
   EMAIL_PASS=your_email_password

   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env.development` and `.env.production` files:
   
   `.env.development`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

   `.env.production`:
   ```env
   VITE_API_BASE_URL=https://your-backend-url.vercel.app/api/v1
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🌐 Deployment

### Backend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from backend directory**
   ```bash
   cd backend
   vercel --prod
   ```

4. **Configure environment variables** in Vercel dashboard

### Frontend Deployment (Vercel)

1. **Deploy from frontend directory**
   ```bash
   cd frontend
   vercel --prod
   ```

2. **Update backend CORS** to include your frontend URL

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Alert Endpoints
- `POST /api/v1/alerts` - Create emergency alert
- `GET /api/v1/alerts` - Get all alerts (Admin only)
- `PUT /api/v1/alerts/:id` - Update alert status (Admin only)

### System Endpoints
- `GET /api/v1/health` - Health check
- `GET /api/v1/test-cors` - CORS test endpoint

## 📱 Usage

### For Users
1. **Access the application** via the frontend URL
2. **Click "Emergency Alert"** button
3. **Allow location access** when prompted
4. **Provide alert details** and submit
5. **Receive confirmation** of alert submission

### For Administrators
1. **Login** with admin credentials
2. **Access admin dashboard**
3. **View all alerts** in real-time
4. **Update alert status** as needed
5. **Monitor system health**

## 🛠️ Development

### Project Structure
```
Alert-System/
├── backend/
│   ├── api/
│   │   └── index.js          # Serverless entry point
│   ├── config/
│   │   └── db.js             # Database configuration
│   ├── controllers/
│   │   ├── alertController.js
│   │   └── authController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Alert.js
│   │   └── User.js
│   ├── routes/
│   │   ├── alertRoutes.js
│   │   └── authRoutes.js
│   ├── utils/
│   │   └── notificationSender.js
│   ├── app.js                # Express app configuration
│   ├── index.js              # Traditional server entry
│   └── vercel.json           # Vercel configuration
├── frontend/
│   ├── public/
│   │   ├── manifest.json
│   │   └── service-worker.js
│   ├── src/
│   │   ├── api/
│   │   │   ├── alertApi.js
│   │   │   ├── authApi.js
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── AlertList.jsx
│   │   │   ├── EmergencyButton.jsx
│   │   │   └── Layout.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── hooks/
│   │   │   ├── useGeoLocation.js
│   │   │   └── useOnlineStatus.js
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── AdminDashboardPage.jsx
│   │   ├── utils/
│   │   │   └── indexedDB.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json           # Vercel configuration
│   └── vite.config.js        # Vite configuration
└── README.md
```

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (if configured)

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔒 Security Considerations

- **Environment Variables**: Never commit sensitive data
- **CORS Configuration**: Properly configured for production
- **Rate Limiting**: Protects against abuse
- **Input Validation**: All inputs are validated
- **JWT Tokens**: Secure token-based authentication
- **HTTPS**: Always use HTTPS in production

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend CORS configuration
   - Ensure frontend URL is whitelisted
   - Verify environment variables

2. **Database Connection**
   - Check MongoDB URI in environment variables
   - Ensure network access is configured
   - Verify credentials

3. **SMS/Email Not Working**
   - Check Twilio credentials
   - Verify email configuration
   - Test with debug mode

4. **Deployment Issues**
   - Check Vercel logs
   - Verify environment variables
   - Ensure proper build configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Digvijay Rana**
- GitHub: [@digvijay778](https://github.com/digvijay778)
- Email: digvijayrana369@gmail.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Vercel for excellent deployment platform
- MongoDB for the database solution
- Twilio for SMS services
- All contributors and testers

## 📞 Support

If you need help or have questions:
1. Check the [Issues](https://github.com/digvijay778/Alert-System/issues) section
2. Create a new issue if your problem isn't already addressed
3. Contact the maintainer directly

---

**⭐ Star this repository if you find it helpful!**
