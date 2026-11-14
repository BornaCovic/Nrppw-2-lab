import { settings } from "./settings";

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

export function renderPage(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="hr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 24px auto; padding: 0 16px; line-height: 1.5; }
    nav a { margin-right: 12px; }
    .settings { border: 1px solid #ccc; border-radius: 6px; padding: 8px 12px; margin: 16px 0; background: #f7f7f7; }
    .settings label { display: block; margin-bottom: 4px; }
    .vulnerable { color: #b00020; font-weight: bold; }
    .safe { color: #1b7f3b; font-weight: bold; }
  </style>
</head>
<body>
  <nav>
    <a href="/">Početna</a>
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
