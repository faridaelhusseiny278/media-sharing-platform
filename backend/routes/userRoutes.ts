import express from 'express';
import * as userController from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET /api/users - Show available endpoints
router.get('/', (req, res) => {
  res.json({
    message: 'Users API',
    endpoints: {
      'POST /register': 'Register a new user',
      'POST /login': 'Login user',
      'GET /profile': 'Get user profile (requires auth)'
    }
  });
});

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authenticateToken, userController.getUserProfile);
// create a router to get user by email
router.get('/email', authenticateToken, userController.getUserByEmail);

export default router;
