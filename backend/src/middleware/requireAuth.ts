import type { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../lib/supabase.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Missing or malformed Authorization header" });
        return;
    }

    const token = header.slice("Bearer ".length).trim();

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
        res.status(401).json({ error: "Invalid or expired token" });
        return;
    }

    req.user = {
        id: data.user.id,
        email: data.user.email ?? null,
    };

    next();
}
