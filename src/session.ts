import { randomUUID } from "crypto";
import { Request } from "express";

// ID sesije -> korisničko ime. Živi u memoriji servera, pa restart odjavljuje sve korisnike.
const sessions = new Map<string, string>();

export function createSession(username: string): string {
  const id = randomUUID();
  sessions.set(id, username);
  return id;
}

export function deleteSession(id: string): void {
  sessions.delete(id);
}

// Preglednik šalje kolačiće u jednom zaglavlju: "Cookie: session=abc-123; drugi=xyz"
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
