import { Request, Response } from "express";
import { getUser, insertUser, User } from "../db";
import { renderPage } from "../layout";
import { encryptCard, hashPassword, verifyPassword } from "../secure";
import { createSession, currentUser, deleteSession, readCookie, setSessionCookie } from "../session";
import { settings } from "../settings";

function renderLoginForm(error: string): string {
  return `
    <p class="error">${error}</p>
    <form method="post" action="/login">
      <p><label>Korisničko ime <input name="username" required></label></p>
      <p><label>Lozinka <input name="password" type="password" required></label></p>
      <button>Prijava</button>
    </form>
    <p>Testni korisnici: <code>ana / ana123</code>, <code>marko / marko123</code>, <code>petra / petra123</code></p>
    <p>Nemaš račun? <a href="/register">Registriraj se</a></p>
  `;
}

function renderRegisterForm(error: string): string {
  return `
    <p class="error">${error}</p>
    <form method="post" action="/register">
      <p><label>Korisničko ime <input name="username" required></label></p>
      <p><label>Lozinka <input name="password" type="password" required></label></p>
      <p><label>Broj kartice <input name="card" required pattern="[0-9]{13,19}" placeholder="4111111111111111"></label></p>
      <button>Registracija</button>
    </form>
    <div class="hint">
      <p>
        Dok je nesigurna pohrana uključena, lozinka i broj kartice spremaju se kao čisti tekst.
        Kad je isključena, lozinka se sprema kao scrypt hash, a kartica kao AES-256-GCM šifrat.
        Rezultat se vidi na stranici <a href="/database">Pregled baze</a>.
      </p>
    </div>
  `;
}

function checkPassword(user: User, password: string): boolean {
  if (user.secure) {
    return verifyPassword(password, user.password);
  }
  return user.password === password;
}

export function handleLoginForm(req: Request, res: Response): void {
  res.send(renderPage("Prijava", renderLoginForm(""), currentUser(req)));
}

export async function handleLogin(req: Request, res: Response): Promise<void> {
  const username = String(req.body.username);
  const password = String(req.body.password);
  const user = await getUser(username);

  if (user === null || !checkPassword(user, password)) {
    res.status(401);
    res.send(renderPage("Prijava", renderLoginForm("Pogrešno korisničko ime ili lozinka."), currentUser(req)));
    return;
  }

  const sessionId = createSession(user.username);
  setSessionCookie(res, sessionId);
  res.redirect("/");
}

export function handleLogout(req: Request, res: Response): void {
  const sessionId = readCookie(req, "session");
  if (sessionId !== undefined) {
    deleteSession(sessionId);
  }
  res.clearCookie("session");
  res.redirect("/");
}

export function handleRegisterForm(req: Request, res: Response): void {
  res.send(renderPage("Registracija", renderRegisterForm(""), currentUser(req)));
}

export async function handleRegister(req: Request, res: Response): Promise<void> {
  const username = String(req.body.username ?? "").trim();
  const password = String(req.body.password ?? "");
  const card = String(req.body.card ?? "").trim();

  if (username === "" || password === "" || card === "") {
    res.status(400);
    res.send(renderPage("Registracija", renderRegisterForm("Sva polja su obavezna."), currentUser(req)));
    return;
  }

  let created = false;
  if (settings.sde) {
    created = await insertUser(username, password, card, false);
  } else {
    created = await insertUser(username, hashPassword(password), encryptCard(card), true);
  }

  if (!created) {
    res.status(409);
    res.send(renderPage("Registracija", renderRegisterForm("Korisničko ime je zauzeto."), currentUser(req)));
    return;
  }

  const sessionId = createSession(username);
  setSessionCookie(res, sessionId);
  res.redirect("/profile");
}
