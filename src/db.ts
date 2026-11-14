import { Pool, PoolConfig } from "pg";

const config: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
};

if (process.env.DATABASE_SSL === "true") {
  config.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(config);

// secure = false: password i card_number su čisti tekst
// secure = true:  password je scrypt hash, card_number je AES-GCM šifrat
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

// Vraća false ako korisničko ime već postoji.
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

export async function seedUsers(): Promise<void> {
  await insertUser("ana", "ana123", "4111111111111111", false);
  await insertUser("marko", "marko123", "5555555555554444", false);
}
