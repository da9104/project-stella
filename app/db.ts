import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client'
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const connectionString = process.env.DATABASE_URL || '';
if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

const globalForPrisma = global as unknown as {
     prisma: PrismaClient | undefined
}
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
})

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

