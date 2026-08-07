// Vercel serverless entry point: this catch-all route file handles every
// request under /api/*. It simply hands the request to the shared Express
// app — Express apps are valid (req, res) handlers, which is exactly what
// Vercel's Node.js runtime expects here.
import { app } from "./_app";

export default app;
