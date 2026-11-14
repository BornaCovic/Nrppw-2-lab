import { Request, Response } from "express";
import { listUsers } from "../db";
import { escapeHtml, renderPage } from "../layout";
import { currentUser } from "../session";

export async function handleDatabase(req: Request, res: Response): Promise<void> {
  const users = await listUsers();

  let rows = "";
  for (const user of users) {
    rows += `
      <tr>
        <td>${user.id}</td>
        <td>${escapeHtml(user.username)}</td>
        <td>${escapeHtml(user.password)}</td>
        <td>${escapeHtml(user.card_number)}</td>
        <td>${user.secure}</td>
      </tr>`;
  }

  const body = `
    <div class="hint">
      <p>
        Sirovi sadržaj tablice <code>users</code>, onako kako ga vidi napadač koji je došao do baze
        (ukradeni dump ili backup, SQL injection). Ranjivo spremljeni korisnici imaju lozinku i karticu
        u čistom tekstu, a sigurno spremljeni samo hash (<code>salt:hash</code>) i šifrat (<code>iv:tag:šifrat</code>).
      </p>
    </div>
    <table>
      <tr><th>id</th><th>username</th><th>password</th><th>card_number</th><th>secure</th></tr>
      ${rows}
    </table>
  `;
  res.send(renderPage("Pregled baze", body, currentUser(req)));
}
