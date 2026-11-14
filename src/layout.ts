import { settings } from "./settings";

export function escapeHtml(text: string): string {
  let result = text;
  result = result.replaceAll("&", "&amp;");
  result = result.replaceAll("<", "&lt;");
  result = result.replaceAll(">", "&gt;");
  result = result.replaceAll('"', "&quot;");
  result = result.replaceAll("'", "&#39;");
  return result;
}

function renderUser(username: string | undefined): string {
  if (username === undefined) {
    return `<a href="/login">Prijava</a> <a href="/register">Registracija</a>`;
  }
  return `
    Prijavljen kao <strong>${escapeHtml(username)}</strong>
    <form class="inline" method="post" action="/logout"><button>Odjava</button></form>
  `;
}

function renderStatus(enabled: boolean): string {
  if (enabled) {
    return `<span class="vulnerable">RANJIVO</span>`;
  }
  return `<span class="safe">SIGURNO</span>`;
}

function checkedAttr(enabled: boolean): string {
  if (enabled) {
    return "checked";
  }
  return "";
}

export function renderPage(title: string, body: string, username: string | undefined): string {
  return `<!DOCTYPE html>
<html lang="hr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 24px auto; padding: 0 16px; line-height: 1.5; }
    nav { display: flex; justify-content: space-between; align-items: center; }
    nav a { margin-right: 12px; }
    .inline { display: inline; }
    .error { color: #b00020; }
    .hint { border-left: 4px solid #999; padding: 4px 12px; margin: 16px 0; background: #fafafa; }
    .hint pre { background: #eee; padding: 4px 8px; overflow-x: auto; }
    .comment { border-bottom: 1px solid #ddd; padding: 8px 0; }
    .comment .meta { color: #555; font-size: 0.9em; }
    .comment .content { white-space: pre-wrap; }
    textarea { width: 100%; box-sizing: border-box; }
    .settings { border: 1px solid #ccc; border-radius: 6px; padding: 8px 12px; margin: 16px 0; background: #f7f7f7; }
    .settings label { display: block; margin-bottom: 4px; }
    .vulnerable { color: #b00020; font-weight: bold; }
    .safe { color: #1b7f3b; font-weight: bold; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 4px 8px; text-align: left; vertical-align: top; }
    td { font-family: monospace; word-break: break-all; }
  </style>
</head>
<body>
  <nav>
    <span><a href="/">Početna</a> <a href="/comments">Komentari</a> <a href="/profile">Profil</a> <a href="/database">Pregled baze</a></span>
    <span>${renderUser(username)}</span>
  </nav>
  <form class="settings" method="post" action="/settings">
    <label>
      <input type="checkbox" name="xss" ${checkedAttr(settings.xss)}>
      XSS ranjivost uključena: ${renderStatus(settings.xss)}
    </label>
    <label>
      <input type="checkbox" name="sde" ${checkedAttr(settings.sde)}>
      Nesigurna pohrana osjetljivih podataka uključena: ${renderStatus(settings.sde)}
    </label>
    <button>Spremi postavke</button>
  </form>
  <h1>${title}</h1>
  ${body}
</body>
</html>`;
}
