// backend/models/friendModel.ts
import { db } from "./db";

export const addFriend = async (userId: number, friendId: number) => {
  await db.execute("INSERT IGNORE INTO friends (user_id, friend_id) VALUES (?, ?)", [
    userId,
    friendId,
  ]);
};

export const removeFriend = async (userId: number, friendId: number) => {
  await db.execute("DELETE FROM friends WHERE user_id = ? AND friend_id = ?", [
    userId,
    friendId,
  ]);
};

export const getFriends = async (userId: number) => {
  const [rows] = await db.execute(
    `SELECT u.id, u.email FROM users u 
     JOIN friends f ON u.id = f.friend_id 
     WHERE f.user_id = ?`,
    [userId]
  );
  return rows;
};

export const areFriends = async (userId: number, friendId: number) => {
  const [rows] = await db.execute(
    "SELECT u.id, u.email FROM friends WHERE user_id = ? AND friend_id = ?",
    [userId, friendId]
  );
  return (rows as any[]).length > 0;
};

export const searchUsers = async (userId: number, query: string) => {
  const [rows] = await db.execute(`
    SELECT u.id, u.email
    FROM users u
    LEFT JOIN friends f ON u.id = f.friend_id AND f.user_id = ?
    WHERE u.email LIKE ?
      AND u.id != ?
      AND f.friend_id IS NULL
    ORDER BY u.email ASC
    LIMIT 10
  `, [userId, `${query}%`, userId]);
  
  
  return rows;
};

export const getAvailableUsers = async (userId: number) => {
  const [rows] = await db.execute(`
    SELECT u.id, u.email
    FROM users u
    WHERE u.id != ?
      AND u.id NOT IN (
        SELECT friend_id FROM friends WHERE user_id = ?
      )
    ORDER BY u.email ASC
  `, [userId, userId]);
  
  return rows;
};
