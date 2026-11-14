import { Request, Response } from "express";
import { renderPage } from "../layout";
import { currentUser } from "../session";

export function handleHome(req: Request, res: Response): void {
  const body = `
    <p>Aplikacija demonstrira dvije sigurnosne ranjivosti web-aplikacija:</p>
    <ul>
      <li><strong>Cross-site scripting (Stored XSS)</strong></li>
      <li><strong>Nesigurna pohrana osjetljivih podataka (Sensitive Data Exposure)</strong></li>
    </ul>
    <p>
      Prekidačima iznad svaka se ranjivost uključuje ili isključuje.
      Stanje vrijedi za sve posjetitelje, a nakon restarta servera obje su ranjivosti ponovno uključene.
    </p>
  `;
  res.send(renderPage("Sigurnosne ranjivosti web-aplikacija", body, currentUser(req)));
}
