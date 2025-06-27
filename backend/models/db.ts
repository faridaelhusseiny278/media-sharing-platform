// backend/models/db.ts
import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",       // or your DB host
  user: "root",            // your MySQL user
  password: "Deda2782002!",
  database: "media_app",
});
