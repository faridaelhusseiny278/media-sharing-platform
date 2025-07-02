# Media Sharing App - Full Stack Social Platform

A comprehensive social media application with user authentication, media sharing, and cross-platform support. The project consists of a **Node.js/Express backend**, **React frontend**, and **Flutter mobile app**.

## 🏗️ Architecture Overview

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Web     │    │  Flutter Mobile │    │  Node.js API    │
│   Frontend      │    │     App         │    │   Backend       │
│                 │    │                 │    │                 │
│  - User Auth    │    │  - User Auth    │    │  - REST API     │
│  - Media Upload │    │  - Media Upload │    │  - JWT Auth     │
│  - Post Feed    │    │  - Post Feed    │    │  - File Storage │
│  - Like System  │    │  - Like System  │    │  - MySQL DB     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   MySQL Database│
                    │                 │
                    │  - Users        │
                    │  - Posts        │
                    │  - Likes        │
                    │  - Friends      │
                    └─────────────────┘
```

### Technology Stack

#### Backend (Node.js/Express)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: express-fileupload
- **Security**: bcryptjs for password hashing, CORS enabled

#### Frontend (React)
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Icons**: React Icons

#### Mobile (Flutter)
- **Framework**: Flutter with Dart
- **HTTP Client**: http package
- **File Handling**: image_picker, file_picker
- **Video Player**: video_player, chewie
- **State Management**: Provider
- **Local Storage**: shared_preferences

## 🚀 Features

### Core Features
- ✅ **User Authentication**: Registration, login, logout with JWT
- ✅ **Media Upload**: Support for images and videos
- ✅ **Social Features**: Like/unlike posts, friend system
- ✅ **Cross-Platform**: Web, mobile, and responsive design
- ✅ **Real-time Updates**: Dynamic post feed updates

### 🎯 Extra Features Implemented

Beyond the basic requirements, this project includes several advanced features that enhance the user experience and demonstrate full-stack development capabilities:

#### 👥 **Social Networking Features**
- **Friend System**: Add, remove, and manage friends
- **User Profiles**: Detailed user profiles with post history
- **Social Feed**: Personalized feed showing posts from friends
- **User Discovery**: Browse and connect with other users

## 📱 Screenshots

### 🌐 Web Application

#### Authentication
<div align="center">
  <img src="images/web screens/signin.png" alt="Web Sign In" width="300"/>
  <img src="images/web screens/register.png" alt="Web Register" width="300"/>
</div>

#### Main Features
<div align="center">
  <img src="images/web screens/home.png" alt="Web Home Feed" width="400"/>
  <p><em>Home feed with media posts and like functionality</em></p>
</div>

<div align="center">
  <img src="images/web screens/profile.png" alt="Web User Profile" width="400"/>
  <p><em>User profile with post history and statistics</em></p>
</div>

#### Social Features
<div align="center">
  <img src="images/web screens/friends.png" alt="Web Friends List" width="400"/>
  <p><em>Friends management and social connections</em></p>
</div>

<div align="center">
  <img src="images/web screens/findfriends.png" alt="Web Find Friends" width="400"/>
  <p><em>Discover and connect with other users</em></p>
</div>

<div align="center">
  <img src="images/web screens/likedposts.png" alt="Web Liked Posts" width="400"/>
  <p><em>View all posts you've liked</em></p>
</div>

### 📱 Mobile Application

#### Authentication
<div align="center">
  <img src="images/mobile screens/sign in.jfif" alt="Mobile Sign In" width="200"/>
  <img src="images/mobile screens/sign up.jfif" alt="Mobile Sign Up" width="200"/>
</div>

#### Core Features
<div align="center">
  <img src="images/mobile screens/home.jfif" alt="Mobile Home" width="200"/>
  <p><em>Mobile home feed with swipeable posts</em></p>
</div>

<div align="center">
  <img src="images/mobile screens/preview.jfif" alt="Mobile Media Preview" width="200"/>
  <p><em>Media preview and upload functionality</em></p>
</div>

#### Social Features
<div align="center">
  <img src="images/mobile screens/friends.jfif" alt="Mobile Friends" width="200"/>
  <p><em>Friends list and social connections</em></p>
</div>

<div align="center">
  <img src="images/mobile screens/myposts.jfif" alt="Mobile My Posts" width="200"/>
  <p><em>Personal posts with management options</em></p>
</div>

<div align="center">
  <img src="images/mobile screens/profileliked.jfif" alt="Mobile Liked Posts" width="200"/>
  <p><em>Profile view with liked posts</em></p>
</div>

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- **Flutter** (v3.5.4 or higher) - for mobile development


## 🛠️ Setup Instructions

### 1. Backend Setup

#### Step 1: Navigate to backend directory
```bash
cd backend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Database Configuration
1. Create a MySQL database:
```sql
CREATE DATABASE media_app;
```



#### Step 4: Environment Variables
Create a `.env` file in the backend directory:
```env
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=media_app
```

#### Step 5: Start the backend server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 2. Frontend Setup

#### Step 1: Navigate to frontend directory
```bash
cd frontend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Configure API endpoint
Update the API base URL in `frontend/src/utils/api.ts` if needed:
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

#### Step 4: Start the frontend development server
```bash
npm start
```

The React app will start on `http://localhost:3000`

### 3. Mobile App Setup

#### Step 1: Navigate to mobile directory
```bash
cd mobile
```

#### Step 2: Install Flutter dependencies
```bash
flutter pub get
```

#### Step 3: Configure API endpoint
Update the API base URL in `mobile/lib/config.dart`:
```dart
const String baseUrl = 'http://localhost:5000/api';
```

#### Step 4: Run the mobile app
```bash
# For Android
flutter run

# For iOS (macOS only)
flutter run -d ios
```



## 🔌 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)

### Posts
- `GET /api/posts` - Get all posts (protected)
- `POST /api/posts` - Create new post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)

### Likes
- `POST /api/likes/like` - Like a post (protected)
- `POST /api/likes/unlike` - Unlike a post (protected)

### Friends
- `GET /api/friends` - Get user's friends (protected)
- `POST /api/friends/add` - Add friend (protected)
- `DELETE /api/friends/:id` - Remove friend (protected)

## 🚀 Running the Application

### Development Mode

1. **Start Backend** (Terminal 1):
```bash
cd backend
npm run dev
```

2. **Start Frontend** (Terminal 2):
```bash
cd frontend
npm start
```

3. **Start Mobile** (Terminal 3):
```bash
cd mobile
flutter run
```




## 🔒 Security Considerations

1. **Authentication**: JWT tokens with expiration
2. **File Upload**: File type and size validation
3. **CORS**: Configured for specific origins
4. **Password Security**: bcrypt hashing with salt
