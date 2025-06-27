import { Request, Response } from 'express';
import * as PostModel from '../models/postModel';

export const likePost = async (req: Request, res: Response) => {
  const { postId } = req.body;
  const userId = (req as any).user?.id; // Get from JWT token

  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  try {
    await PostModel.likePost(postId, userId);
    res.status(200).json({ message: 'Post liked' });
  } catch (error) {
    res.status(500).json({ error: 'Error liking post' });
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  const { postId } = req.body;
  const userId = (req as any).user?.id; // Get from JWT token

  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  try {
    await PostModel.unlikePost(postId, userId);
    res.status(200).json({ message: 'Post unliked' });
  } catch (error) {
    res.status(500).json({ error: 'Error unliking post' });
  }
};
