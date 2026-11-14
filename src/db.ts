import { Pool, PoolConfig } from "pg";
import { encryptCard, hashPassword } from "./secure";

const config: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
};

if (process.env.DATABASE_SSL === "true") {
  config.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(config);

export interface User {
  id: number;
  username: string;
  password: string;
  card_number: string;
  secure: boolean;
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  created_at: Date;
}

export async function createTables(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR UNIQUE NOT NULL,
      password VARCHAR NOT NULL,
      card_number VARCHAR NOT NULL,
      secure BOOLEAN NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      author VARCHAR NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function insertUser(
  username: string,
  password: string,
  cardNumber: string,
  secure: boolean
): Promise<boolean> {
  const result = await pool.query(
    `INSERT INTO users (username, password, card_number, secure)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (username) DO NOTHING`,
    [username, password, cardNumber, secure]
  );
  return result.rowCount === 1;
}

export async function getUser(username: string): Promise<User | null> {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  if (result.rows.length === 0) {
    return null;
  }
  const user: User = result.rows[0];
  return user;
}

export async function listUsers(): Promise<User[]> {
  const result = await pool.query("SELECT * FROM users ORDER BY id");
  const users: User[] = result.rows;
  return users;
}

export async function insertComment(author: string, content: string): Promise<void> {
  await pool.query("INSERT INTO comments (author, content) VALUES ($1, $2)", [author, content]);
}

export async function listComments(): Promise<Comment[]> {
  const result = await pool.query("SELECT * FROM comments ORDER BY created_at");
  const comments: Comment[] = result.rows;
  return comments;
}

export async function deleteAllComments(): Promise<void> {
  await pool.query("DELETE FROM comments");
}

export async function seedUsers(): Promise<void> {
  await insertUser("ana", "ana123", "4111111111111111", false);
  await insertUser("marko", "marko123", "5555555555554444", false);
  await insertUser("petra", hashPassword("petra123"), encryptCard("4000056655665556"), true);
}
