import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client'
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const connectionString = process.env.DATABASE_URL || '';
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

// const globalForPrisma = global as unknown as {
//      prisma: PrismaClient | undefined
// }
// export const prisma = globalForPrisma.prisma ?? new PrismaClient()

export const prisma =  new PrismaClient({ 
    adapter 
});

declare global {
    var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV !== 'production') {
    if (!global.prisma) {
        global.prisma = prisma;
    }
}

