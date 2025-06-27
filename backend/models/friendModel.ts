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
    `SELECT u.* FROM users u 
     JOIN friends f ON u.id = f.friend_id 
     WHERE f.user_id = ?`,
    [userId]
  );
  return rows;
};

export const areFriends = async (userId: number, friendId: number) => {
  const [rows] = await db.execute(
    "SELECT * FROM friends WHERE user_id = ? AND friend_id = ?",
    [userId, friendId]
  );
  return (rows as any[]).length > 0;
};
