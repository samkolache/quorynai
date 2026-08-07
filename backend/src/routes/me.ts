import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { supabaseAdmin } from "../lib/supabase.js";
import * as z from "zod"; 

const profileUpdateSchema = z.strictObject({
    display_name: z.string().trim().min(1).max(80).optional(),
    birth_date: z.iso.date().optional(),
    birth_time: z.iso.time().optional(),
    birth_place: z.string().trim().min(1).max(200).optional(),
    birth_lat: z.number().min(-90).max(90).optional(),
    birth_lng: z.number().min(-180).max(180).optional(),
    birth_timezone: z.string().trim().min(1).max(64).optional(),
});

function isOnboarded(profile: { birth_date: string | null; birth_place: string | null }) {
    return profile.birth_date !== null && profile.birth_place !== null;
}

const meRouter = Router();

meRouter.get("/me", requireAuth, async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        console.error("Failed to load profile:", error);
        res.status(500).json({ error: "Could not load profile" });
        return;
    }

    res.json({ profile: data, isOnboarded: isOnboarded(data) });
});

meRouter.patch("/me", requireAuth, async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const parsed = profileUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({
            error: "Invalid profile data",
            details: z.flattenError(parsed.error),
        });
        return;
    }

    if (Object.keys(parsed.data).length === 0) {
        res.status(400).json({ error: "No fields to update" });
        return;
    }

    const { data, error } = await supabaseAdmin
        .from("profiles")
        .update(parsed.data)
        .eq("id", userId)
        .select()
        .single();

    if (error) {
        console.error("Failed to update profile:", error);
        res.status(500).json({ error: "Could not update profile" });
        return;
    }

    res.json({ profile: data, isOnboarded: isOnboarded(data) });
});

export default meRouter;
