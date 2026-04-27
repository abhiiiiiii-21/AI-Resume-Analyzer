/* SOLID — D (Dependency Inversion Principle) */

// Shape of data needed to sync a Clerk user into our DB
export interface SyncUserData {
  id: string;    
  email: string; 
}
 
export interface IUserRepository {
  upsert(data: SyncUserData): Promise<void>;
  findById(id: string): Promise<any | null>;
}
 
