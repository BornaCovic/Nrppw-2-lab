import { Request, Response } from "express";

// Stanje prekidača: globalno, u memoriji servera, zajedničko za sve posjetitelje.
// Nakon restarta servera vraća se na default (obje ranjivosti uključene).
export const settings = {
  xss: true,
  sde: true,
};

// Označeni checkbox preglednik šalje kao "xss=on", a neoznačeni uopće ne šalje.
// Zato "polje ne postoji" znači da je ranjivost isključena.
export function handleSettings(req: Request, res: Response): void {
  settings.xss = req.body.xss === "on";
  settings.sde = req.body.sde === "on";
  res.redirect(req.get("Referer") ?? "/");
}
