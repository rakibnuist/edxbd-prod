import { PrismaClient } from '@prisma/client';

/**
 * The production image is built from git with no database (the SQLite file
 * lives on the VPS volume and is only mounted at runtime). During `next build`
 * only, a read that cannot reach the database returns an empty result instead
 * of failing the build; the page is prerendered empty and the running server
 * re-renders it with real data (see docker-entrypoint.sh). At runtime every
 * error is thrown as normal.
 */
const IS_BUILD = process.env.NEXT_PHASE === 'phase-production-build';
const EMPTY_ON_BUILD: Record<string, unknown> = {
  findMany: [],
  groupBy: [],
  findFirst: null,
  findUnique: null,
  count: 0,
};
let warned = false;

const prismaClientSingleton = () => {
  const client = new PrismaClient();
  if (!IS_BUILD) return client;
  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, args, query }) {
          try {
            return await query(args);
          } catch (error) {
            const unreachable = error instanceof Error && error.name === 'PrismaClientInitializationError';
            if (!unreachable || !(operation in EMPTY_ON_BUILD)) throw error;
            if (!warned) {
              warned = true;
              console.warn('[build] Database unavailable; prerendering with empty data. Pages refresh once the server runs.');
            }
            return EMPTY_ON_BUILD[operation];
          }
        },
      },
    },
  }) as unknown as PrismaClient;
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
