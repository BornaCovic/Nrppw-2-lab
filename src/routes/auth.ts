import { Request, Response } from "express";
import { getUser } from "../db";
import { renderPage } from "../layout";
import { createSession, currentUser, deleteSession, readCookie, setSessionCookie } from "../session";

function renderLoginForm(error: string): string {
  return `
    <p class="error">${error}</p>
    <form method="post" action="/login">
      <p><label>Korisničko ime <input name="username" required></label></p>
      <p><label>Lozinka <input name="password" type="password" required></label></p>
      <button>Prijava</button>
    </form>
    <p>Testni korisnici: <code>ana / ana123</code>, <code>marko / marko123</code></p>
  `;
}

export function handleLoginForm(req: Request, res: Response): void {
  res.send(renderPage("Prijava", renderLoginForm(""), currentUser(req)));
}

export async function handleLogin(req: Request, res: Response): Promise<void> {
  const username = String(req.body.username);
  const password = String(req.body.password);
  const user = await getUser(username);

  if (user === null || user.password !== password) {
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
