import app from './app';
import { env } from './config/env';

/**
 * Server Entry Point
 * 
 * This is where the HTTP server starts.
 * It imports the fully-configured Express app and listens on the configured port.
 * 
 * Separation between app.ts and server.ts is intentional:
 * - app.ts  → configures Express (testable without starting server)
 * - server.ts → actually starts listening (the "main" entry point)
 * 
 * Run with: npm run dev (uses ts-node-dev for hot reload)
 */
const PORT = env.port;

app.listen(PORT, () => {
    console.log(`\n🚀 Resume Builder Service is running`);
    console.log(`   Environment : ${env.nodeEnv}`);
    console.log(`   Port        : ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/v1/health`);
    console.log(`   CORS origins: ${env.corsOrigins.join(', ')}\n`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (reason: any) => {
    console.error('❌ Unhandled Rejection:', reason);
    // In production, you might want to gracefully shut down here
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});
