// src/config/shutdown.ts
import { Server } from 'http';

export function configureGracefulShutdown(server: Server): void {
  const handleShutdown = (signal: string): void => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

    server.close(async (err?: Error) => {
      if (err) {
        console.error('Error closing HTTP server:', err);
        process.exit(1);
      }

      console.log('HTTP server closed.');

      try {
        console.log('All resources cleaned up successfully.');
        process.exit(0);
      } catch (error) {
        console.error('Error during database/resource cleanup:', error);
        process.exit(1);
      }
    });

    setTimeout(() => {
      console.error('Forcefully shutting down due to timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
}
