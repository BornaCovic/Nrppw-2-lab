import { Request, Response } from "express";
import { deleteAllComments, insertComment, listComments } from "../db";
import { escapeHtml, renderPage } from "../layout";
import { currentUser } from "../session";
import { settings } from "../settings";

function renderContent(content: string): string {
  if (settings.xss) {
    return content;
  }
  return escapeHtml(content);
}

const hint = `
  <div class="hint">
    <p><strong>Kako testirati:</strong> prijavi se kao <code>marko</code> i objavi komentar:</p>
    <pre>&lt;script&gt;alert(document.cookie)&lt;/script&gt;</pre>
    <p>ili</p>
    <pre>&lt;img src=x onerror="alert(document.cookie)"&gt;</pre>
    <p>
      Zatim se odjavi, prijavi kao <code>ana</code> i otvori ovu stranicu.
      Dok je XSS uključen, skripta se izvrši i prikaže kolačić sesije.
      Kad je isključen, komentar se prikaže kao tekst, a kolačić je HttpOnly.
    </p>
  </div>
`;

export async function handleComments(req: Request, res: Response): Promise<void> {
  const username = currentUser(req);
  const comments = await listComments();

  let list = "<p>Još nema komentara.</p>";
  if (comments.length > 0) {
    list = "";
    for (const comment of comments) {
      const time = comment.created_at.toLocaleString("hr-HR", { timeZone: "Europe/Zagreb" });
      list += `
        <div class="comment">
          <div class="meta"><strong>${escapeHtml(comment.author)}</strong>, ${time}</div>
          <div class="content">${renderContent(comment.content)}</div>
        </div>`;
    }
  }

  let form = `<p><a href="/login">Prijavi se</a> da bi ostavio komentar.</p>`;
  if (username !== undefined) {
    form = `
      <form method="post" action="/comments">
        <p><textarea name="content" rows="3" required></textarea></p>
        <button>Objavi komentar</button>
      </form>
      <form method="post" action="/comments/delete">
        <p><button>Obriši sve komentare</button></p>
      </form>`;
  }

  res.send(renderPage("Komentari", hint + list + form, username));
}

export async function handleAddComment(req: Request, res: Response): Promise<void> {
  const username = currentUser(req);
  if (username === undefined) {
    res.redirect("/login");
    return;
  }
  const content = String(req.body.content ?? "").trim();
  if (content !== "") {
    await insertComment(username, content);
  }
  res.redirect("/comments");
}

export async function handleDeleteComments(req: Request, res: Response): Promise<void> {
  if (currentUser(req) === undefined) {
    res.redirect("/login");
    return;
  }
  await deleteAllComments();
  res.redirect("/comments");
}
