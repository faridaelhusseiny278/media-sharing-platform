import express from 'express';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';
import likeRoutes from './likeRoutes';
import friendRoutes from './friendRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/likes', likeRoutes);
router.use('/friends', friendRoutes);

export default router;
