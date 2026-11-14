import express, { Request, Response } from "express";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

function handleHome(req: Request, res: Response): void {
  res.send("NWEB 2LAB: XSS i nesigurna pohrana osjetljivih podataka. Server radi.");
}

function handleListen(): void {
  console.log(`Server sluša na http://localhost:${PORT}`);
}

app.get("/", handleHome);

app.listen(PORT, handleListen);
