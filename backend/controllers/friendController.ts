import { Request, Response } from 'express';
import * as FriendModel from '../models/friendModel';
import * as UserModel from '../models/userModel';

export const addFriend = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { friendEmail } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (!friendEmail) {
      res.status(400).json({ error: 'Friend email is required' });
      return;
    }

    // Find friend by email
    const friend = await UserModel.getUserByEmail(friendEmail);
    if (!friend) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (friend.id === userId) {
      res.status(400).json({ error: 'Cannot add yourself as friend' });
      return;
    }

    // Check if already friends
    const areAlreadyFriends = await FriendModel.areFriends(userId, friend.id);
    if (areAlreadyFriends) {
      res.status(400).json({ error: 'Already friends' });
      return;
    }

    await FriendModel.addFriend(userId, friend.id);
    res.status(200).json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ error: 'Error adding friend' });
  }
};

export const removeFriend = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { friendId } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (!friendId) {
      res.status(400).json({ error: 'Friend ID is required' });
      return;
    }

    await FriendModel.removeFriend(userId, friendId);
    res.status(200).json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ error: 'Error removing friend' });
  }
};

export const getFriends = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const friends = await FriendModel.getFriends(userId);
    res.status(200).json(friends);
  } catch (error) {
    console.error('Error getting friends:', error);
    res.status(500).json({ error: 'Error getting friends' });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { query } = req.query;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    // Search users by email (excluding current user and existing friends)
    const [rows] = await (await import('../models/db')).db.execute(`
      SELECT u.id, u.email, u.created_at
      FROM users u
      WHERE u.email LIKE ? 
        AND u.id != ?
        AND u.id NOT IN (
          SELECT friend_id FROM friends WHERE user_id = ?
        )
      LIMIT 10
    `, [`%${query}%`, userId, userId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Error searching users' });
  }
}; 