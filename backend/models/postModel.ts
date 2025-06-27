// backend/models/postModel.ts
import { db } from "./db";

export const createPost = async (userId: number, filepath: string) => {
  const [result] = await db.execute(
    "INSERT INTO posts (user_id, filepath) VALUES (?, ?)",
    [userId, filepath]
  );
  return result;
};

export const getAllPosts = async (userId: number) => {
  // Get posts from user and their friends with like count and user info
  const [rows] = await db.execute(`
    SELECT p.*, 
      u.email as user_email,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likeCount,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND user_id = ?) as userLiked
    FROM posts p 
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = ? 
       OR p.user_id IN (
         SELECT friend_id FROM friends WHERE user_id = ?
       )
    ORDER BY p.created_at DESC
  `, [userId, userId, userId]);
  
  return rows;
};

export const likePost = async (postId: number, userId: number) => {
  await db.execute("INSERT IGNORE INTO post_likes (post_id, user_id) VALUES (?, ?)", [
    postId,
    userId,
  ]);
};

export const unlikePost = async (postId: number, userId: number) => {
  await db.execute("DELETE FROM post_likes WHERE post_id = ? AND user_id = ?", [
    postId,
    userId,
  ]);
};

export const hasUserLikedPost = async (postId: number, userId: number) => {
  const [rows] = await db.execute(
    "SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?",
    [postId, userId]
  );
  return (rows as any[]).length > 0;
};
