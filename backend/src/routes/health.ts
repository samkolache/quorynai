import { Router} from "express";
import type { Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase.js";


const healthRouter = Router();

healthRouter.get("/health", (_req: Request, res: Response) => { 
    res.json({status: "ok", "uptime": process.uptime()});
});


healthRouter.get("/health/db", async (_req: Request, res: Response) => {
    
    const { count, error } = await supabaseAdmin
        .from("profiles")
        .select("*", { count: "exact", head: true });

  
    if (error) {
        
        console.error("DB health check failed:", error);

        res.status(500).json({ database: "error", message: error.message });
        return;
    }
    res.json({ database: "connected", profileCount: count ?? 0 });
});

export default healthRouter;
