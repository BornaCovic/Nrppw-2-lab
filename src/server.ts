import "dotenv/config";
import express from "express";
import { createTables, seedUsers } from "./db";
import { handleSettings } from "./settings";
import { handleHome } from "./routes/home";
import { handleLoginForm, handleLogin, handleLogout, handleRegisterForm, handleRegister } from "./routes/auth";
import { handleComments, handleAddComment, handleDeleteComments } from "./routes/comments";
import { handleProfile } from "./routes/profile";
import { handleDatabase } from "./routes/database";
import { refreshSessionCookie } from "./session";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.urlencoded());
app.use(refreshSessionCookie);

app.get("/", handleHome);
app.post("/settings", handleSettings);
app.get("/login", handleLoginForm);
app.post("/login", handleLogin);
app.post("/logout", handleLogout);
app.get("/comments", handleComments);
app.post("/comments", handleAddComment);
app.post("/comments/delete", handleDeleteComments);
app.get("/register", handleRegisterForm);
app.post("/register", handleRegister);
app.get("/profile", handleProfile);
app.get("/database", handleDatabase);

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
