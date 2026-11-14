import { Request, Response } from "express";

export const settings = {
  xss: true,
  sde: true,
};

export function handleSettings(req: Request, res: Response): void {
  settings.xss = req.body.xss === "on";
  settings.sde = req.body.sde === "on";
  res.redirect(req.get("Referer") ?? "/");
}
