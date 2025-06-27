# Media Sharing App

A full-stack social media application with user authentication, file uploads, and like functionality.

## Features

- ✅ User registration and login with JWT authentication
- ✅ File upload (images and videos)
- ✅ Like/unlike posts
- ✅ Modern responsive UI with Tailwind CSS
- ✅ Secure API with authentication middleware
- ✅ Real-time post updates

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MySQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-fileupload** for file handling

### Frontend
- **React** with **TypeScript**
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Context** for state management

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL database
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Database Setup:**
   - Create a MySQL database named `media_app`
   - Update database credentials in `backend/models/db.ts` and `backend/models/index.ts`
   - The tables will be created automatically when you start the server

4. **Environment Variables (optional):**
   Create a `.env` file in the backend directory:
   ```env
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm start
   ```

## Usage

1. **Register a new account** or **login** with existing credentials
2. **Upload media files** (images or videos) using the upload form
3. **Like/unlike posts** from other users
4. **View all posts** in a responsive grid layout
5. **Logout** when finished

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Posts
- `GET /api/posts` - Get all posts (requires auth)
- `POST /api/posts` - Create new post (requires auth)

### Likes
- `POST /api/likes/like` - Like a post (requires auth)
- `POST /api/likes/unlike` - Unlike a post (requires auth)

## File Structure

```
├── backend/
│   ├── controllers/     # API route handlers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── uploads/         # Uploaded files
│   └── server.ts        # Server entry point
├── frontend/
│   ├── src/
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Page components
│   │   ├── utils/       # Utility functions
│   │   └── App.tsx      # Main app component
│   └── package.json
└── README.md
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- File upload validation
- CORS enabled for frontend communication

## Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Ensure MySQL is running
   - Check database credentials in `backend/models/db.ts`
   - Verify database `media_app` exists

2. **File Upload Issues:**
   - Check that `backend/uploads` directory exists
   - Ensure proper file permissions

3. **Authentication Errors:**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify API endpoints are correct

### Development Tips

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`
- Check browser console for frontend errors
- Check terminal for backend errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE). 