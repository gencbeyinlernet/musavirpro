import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { app } from "./api/_app";

// Traditional persistent-server entry point (Render, Railway, a VPS...).
// All API routes live in api/_app.ts, shared with the Vercel serverless
// entry at api/[...path].ts. Here we additionally serve the frontend
// (Vite middleware in dev, static dist/ in production) and start listening.
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
