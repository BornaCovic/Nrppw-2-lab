import "dotenv/config";
import express from "express";
import { createTables, seedUsers } from "./db";
import { handleSettings } from "./settings";
import { handleHome } from "./routes/home";
import { handleLoginForm, handleLogin, handleLogout } from "./routes/auth";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Čita podatke iz HTML formi (application/x-www-form-urlencoded) u req.body.
app.use(express.urlencoded());

app.get("/", handleHome);
app.post("/settings", handleSettings);
app.get("/login", handleLoginForm);
app.post("/login", handleLogin);
app.post("/logout", handleLogout);

function handleListen(): void {
  console.log(`Server sluša na http://localhost:${PORT}`);
}

async function start(): Promise<void> {
  await createTables();
  await seedUsers();
  console.log("Tablice users i comments spremne, testni korisnici upisani");
  app.listen(PORT, handleListen);
}

start();
