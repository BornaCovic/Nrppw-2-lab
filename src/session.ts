import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import { settings } from "./settings";

const sessions = new Map<string, string>();

export function createSession(username: string): string {
  const id = randomUUID();
  sessions.set(id, username);
  return id;
}

export function deleteSession(id: string): void {
  sessions.delete(id);
}

export function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie;
  if (header === undefined) {
    return undefined;
  }
  for (const part of header.split(";")) {
    const [key, value] = part.trim().split("=");
    if (key === name) {
      return value;
    }
  }
  return undefined;
}

export function currentUser(req: Request): string | undefined {
  const id = readCookie(req, "session");
  if (id === undefined) {
    return undefined;
  }
  return sessions.get(id);
}

export function setSessionCookie(res: Response, id: string): void {
  res.cookie("session", id, { httpOnly: !settings.xss, sameSite: "lax" });
}

export function refreshSessionCookie(req: Request, res: Response, next: NextFunction): void {
  const id = readCookie(req, "session");
  if (id !== undefined && sessions.has(id)) {
    setSessionCookie(res, id);
  }
  next();
}
