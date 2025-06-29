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
  `, [userId, userId, userId]);
  
  return rows;
};

export const getMyPosts = async (userId: number) => {
  // Get user's own posts with stats
  const [posts] = await db.execute(`
    SELECT p.*, 
      u.email as user_email,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likeCount,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND user_id = ?) as userLiked
    FROM posts p 
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = ?
  `, [userId, userId]);

  // Get stats
  const [statsResult] = await db.execute(`
    SELECT 
      (SELECT COUNT(*) FROM posts WHERE user_id = ?) as totalPosts,
      (SELECT COUNT(*) FROM post_likes pl JOIN posts p ON pl.post_id = p.id WHERE p.user_id = ?) as totalLikes,
      (SELECT COUNT(*) FROM post_likes WHERE user_id = ?) as totalLikedPosts
  `, [userId, userId, userId]);

  const stats = (statsResult as any[])[0];
  const postsArray = posts as any[];

  return {
    posts: postsArray.map((post: any) => ({
      ...post,
      userLiked: post.userLiked
    })),
    stats: {
      totalPosts: stats.totalPosts,
      totalLikes: stats.totalLikes,
      totalLikedPosts: stats.totalLikedPosts
    }
  };
};

export const getLikedPosts = async (userId: number) => {
  // Get posts that the user has liked
  const [rows] = await db.execute(`
    SELECT p.*, 
      u.email as user_email,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likeCount,
      1 as userLiked
    FROM posts p 
    JOIN users u ON p.user_id = u.id
    JOIN post_likes pl ON p.id = pl.post_id
    WHERE pl.user_id = ?
  `, [userId]);
  
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
