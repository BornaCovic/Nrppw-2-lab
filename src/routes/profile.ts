import { Request, Response } from "express";
import { getUser } from "../db";
import { escapeHtml, renderPage } from "../layout";
import { decryptCard, maskCard } from "../secure";
import { currentUser } from "../session";
import { settings } from "../settings";

export async function handleProfile(req: Request, res: Response): Promise<void> {
  const username = currentUser(req);
  if (username === undefined) {
    res.redirect("/login");
    return;
  }
  const user = await getUser(username);
  if (user === null) {
    res.redirect("/login");
    return;
  }

  let card = user.card_number;
  if (user.secure) {
    card = decryptCard(user.card_number);
  }
  if (!settings.sde) {
    card = maskCard(card);
  }

  let storage = "čisti tekst";
  if (user.secure) {
    storage = "scrypt hash lozinke i AES-256-GCM šifrat kartice";
  }

  const body = `
    <p>Korisničko ime: <strong>${escapeHtml(user.username)}</strong></p>
    <p>Broj kartice: <strong>${escapeHtml(card)}</strong></p>
    <p>Način pohrane u bazi: ${storage}</p>
  `;
  res.send(renderPage("Profil", body, username));
}
