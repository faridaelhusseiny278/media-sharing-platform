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
