// src/config/shutdown.ts
import { Server } from 'http';

export default function configureGracefulShutdown(server: Server): void {
  let isShuttingDown = false;

  const handleShutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) {
      console.log(
        `Received ${signal} but shutdown is already underway. Ignoring.`,
      );
      return;
    }
    isShuttingDown = true;

    console.log(`\nReceived ${signal}. Initiating clean shutdown sequence...`);

    const TIMEOUT_MS = 10000;
    const forceTimeoutId = setTimeout(() => {
      console.error(
        `Shutdown timed out after ${TIMEOUT_MS / 1000}s. Forcing exit.`,
      );
      process.exit(1);
    }, TIMEOUT_MS);

    forceTimeoutId.unref();

    try {
      if (typeof server.closeIdleConnections === 'function') {
        server.closeIdleConnections();
      }

      console.log('Draining active HTTP connections...');
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
      console.log('HTTP server closed cleanly.');

      console.log('All resources cleaned up successfully.');
      clearTimeout(forceTimeoutId);
      process.exit(0);
    } catch (error) {
      console.error(
        'Critical failure during graceful shutdown sequence:',
        error,
      );
      clearTimeout(forceTimeoutId);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => {
    handleShutdown('SIGINT');
  });
  process.on('SIGTERM', () => {
    handleShutdown('SIGTERM');
  });
}
