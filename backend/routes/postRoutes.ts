import express from 'express';
import * as postController from '../controllers/postController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, postController.createPost);
router.get('/', authenticateToken, postController.getPosts);

export default router;
