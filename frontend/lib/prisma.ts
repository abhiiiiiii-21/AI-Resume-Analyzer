import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var _prismaClient: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const prisma = global._prismaClient ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global._prismaClient = prisma;
}

export default prisma;

