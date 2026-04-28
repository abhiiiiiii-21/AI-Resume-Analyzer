import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import dotenv from "dotenv";

dotenv.config();

class Database {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!Database.instance) {
      const connectionString = process.env.DATABASE_URL;
      
      if (!connectionString) {
        throw new Error("DATABASE_URL is not defined in environment variables.");
      }

      const pool = new Pool({ 
        connectionString,
        ssl: true 
      });
      const adapter = new PrismaPg(pool);
      
      Database.instance = new PrismaClient({ adapter });
    }
    return Database.instance;
  }
}

export default Database.getInstance();