import { Request, Response } from 'express';
import * as PostModel from '../models/postModel';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';

export const createPost = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id; // from token
      const file = req.files?.media as UploadedFile;
        // copy the file to the uploads folder
        fs.copyFileSync(file.tempFilePath, 'uploads/' + file.name);

      const filepath = file.name;
    




      const post = await PostModel.createPost(userId, filepath);
      res.status(201).json(post);
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({ error: 'Error creating post' });
    }
  };
    
export const getPosts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const posts = await PostModel.getAllPosts(userId);
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ error: 'Error retrieving posts' });
  }
};

export const getMyPosts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const result = await PostModel.getMyPosts(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error retrieving my posts:', error);
    res.status(500).json({ error: 'Error retrieving my posts' });
  }
};

export const getLikedPosts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const posts = await PostModel.getLikedPosts(userId);
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error retrieving liked posts:', error);
    res.status(500).json({ error: 'Error retrieving liked posts' });
  }
};


export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const postId = parseInt(req.params.id); 
    console.log('Deleting post with ID:', postId, " for user ID:", userId);


    if (!userId) {
       res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if the post belongs to the user
    const post = await PostModel.getPostById(postId);
    if (!post) {
       res.status(404).json({ error: 'Post not found' });
    }

    if (post.user_id !== userId) {
       res.status(403).json({ error: 'You can only delete your own posts' });
    }

    // Delete the media file if needed
    const mediaPath = path.join('uploads', post.filepath);
    if (fs.existsSync(mediaPath)) {
      fs.unlinkSync(mediaPath);
    }

    // Delete the post
    await PostModel.deletePost(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Error deleting post' });
  }
};

export const isMine = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const postId = parseInt(req.params.id); 

  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  try {
    const post = await PostModel.getPostById(postId);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const isMine = post.user_id === userId;
    res.status(200).json({ isMine });
  } catch (error) {
    console.error('Error checking ownership:', error);
    res.status(500).json({ error: 'Error checking ownership' });
  }
};

