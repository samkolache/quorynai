import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
    console.log(`   env:      ${env.NODE_ENV}`);
    console.log(`   frontend: ${env.FRONTEND_URL}`);
});

for (const signal of ["SIGTERM", "SIGINT"] as const) {
    process.on(signal, () => {
        console.log(`\n${signal} received, shutting down...`);
        server.close(() => {
            console.log("Closed remaining connections. Bye.");
            process.exit(0);
        });
    });
}
