import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().int().positive().default(3000),
    FRONTEND_URL: z.url().default("http://localhost:5173"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    SUPABASE_URL: z.url(),
    SUPABASE_SECRET_KEY: z.string().min(20),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables:");
    console.error(z.prettifyError(parsed.error));
    process.exit(1);
}

export const env = parsed.data;

export const isDev = env.NODE_ENV === "development";
