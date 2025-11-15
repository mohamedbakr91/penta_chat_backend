import { Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private readonly logger = new Logger(RedisIoAdapter.name);
  private pubClient;
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    try {
      const pubClient = createClient({
        password: process.env.REDIS_PASSWORD,
        username: process.env.REDIS_USERNAME,
        database: process.env.REDIS_DB
          ? parseInt(process.env.REDIS_DB)
          : undefined,
        socket: {
          port: process.env.REDIS_PORT
            ? parseInt(process.env.REDIS_PORT)
            : 6379,
          host: process.env.REDIS_HOST,
        },
      });
      const subClient = pubClient.duplicate();

      await Promise.all([pubClient.connect(), subClient.connect()]);

      this.logger.log(`Connected to Webosckets Redis Adapter`);
      this.adapterConstructor = createAdapter(pubClient, subClient);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }

  getClient() {
    if (!this.pubClient) {
      throw new Error(
        'Redis client not initialized. Call connectToRedis first.',
      );
    }
    return this.pubClient;
  }
}
