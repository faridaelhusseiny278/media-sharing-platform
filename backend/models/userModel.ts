// backend/models/userModel.ts
import { db } from "./db";
import bcrypt from 'bcryptjs';

export const createUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.execute(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword]
  );
  return result;
};

export const getUserByEmail = async (email: string) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return (rows as any[])[0];
};
export const getUserById = async (id: number) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
  return (rows as any[])[0];
};

export const getAllUsers = async () => {
  const [rows] = await db.execute("SELECT * FROM users");
  return rows;
};
