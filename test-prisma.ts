import { PrismaClient } from '@prisma/client';
console.log(new PrismaClient({ datasourceUrl: 'file:./dev.db' } as any));
