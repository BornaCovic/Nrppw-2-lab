import { Request, Response } from "express";
import { renderPage } from "../layout";
import { currentUser } from "../session";

export function handleHome(req: Request, res: Response): void {
  const body = `
    <p>Aplikacija demonstrira dvije sigurnosne ranjivosti web-aplikacija:</p>
    <ul>
      <li><strong>Cross-site scripting (Stored XSS)</strong>, stranica <a href="/comments">Komentari</a></li>
      <li>
        <strong>Nesigurna pohrana osjetljivih podataka (Sensitive Data Exposure)</strong>, stranice
        <a href="/register">Registracija</a>, <a href="/profile">Profil</a> i <a href="/database">Pregled baze</a>
      </li>
    </ul>
    <p>
      Prekidačima iznad svaka se ranjivost uključuje ili isključuje.
      Stanje vrijedi za sve posjetitelje, a nakon restarta servera obje su ranjivosti ponovno uključene.
    </p>
  `;
  res.send(renderPage("Sigurnosne ranjivosti web-aplikacija", body, currentUser(req)));
}
