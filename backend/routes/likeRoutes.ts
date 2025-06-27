import express from 'express';
import * as likeController from '../controllers/likeController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/like', authenticateToken, likeController.likePost);
router.post('/unlike', authenticateToken, likeController.unlikePost);

export default router;
