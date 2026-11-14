import "dotenv/config";
import express, { Request, Response } from "express";
import { createTables, seedUsers } from "./db";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

function handleHome(req: Request, res: Response): void {
  res.send("NWEB 2LAB: XSS i nesigurna pohrana osjetljivih podataka. Server radi.");
}

function handleListen(): void {
  console.log(`Server sluša na http://localhost:${PORT}`);
}

app.get("/", handleHome);

async function start(): Promise<void> {
  await createTables();
  await seedUsers();
  console.log("Tablice users i comments spremne, testni korisnici upisani");
  app.listen(PORT, handleListen);
}

start();
