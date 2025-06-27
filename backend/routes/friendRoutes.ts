import express from 'express';
import * as friendController from '../controllers/friendController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All friend routes require authentication
router.use(authenticateToken);

// GET /api/friends - Show available endpoints
router.get('/', (req, res) => {
  res.json({
    message: 'Friends API',
    endpoints: {
      'GET /friends': 'Get user friends list',
      'POST /friends/add': 'Add a friend by email',
      'POST /friends/remove': 'Remove a friend',
      'GET /friends/search': 'Search for users to add as friends'
    }
  });
});

router.get('/list', friendController.getFriends);
router.post('/add', friendController.addFriend);
router.post('/remove', friendController.removeFriend);
router.get('/search', friendController.searchUsers);

export default router; 