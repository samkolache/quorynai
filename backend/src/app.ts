import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import healthRouter from "./routes/health.js";
import meRouter from "./routes/me.js";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.use((req, res, next) => {
  const startedAt = performance.now();

  res.on("finish", () => {
    const ms = (performance.now() - startedAt).toFixed(1);
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
  });

  next(); 
});

app.use("/api", healthRouter);
app.use("/api", meRouter);


app.use((req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
});

export default app;
