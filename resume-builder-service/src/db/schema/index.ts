/**
 * Schema Barrel Export
 * 
 * Re-exports all schema tables from a single file.
 * This is imported by the Drizzle client (db.ts) to enable
 * type-safe relational queries like db.query.users.findMany().
 * 
 * When you add a new schema table, add its export here.
 */

export { users } from './users';
export { builderSessions, sessionStatusEnum } from './builder-sessions';
export { chatMessages, messageRoleEnum } from './chat-messages';
export { resumeDrafts, draftStatusEnum } from './resume-drafts';
export { resumes } from './resumes';
export { resumeAssets, assetTypeEnum } from './resume-assets';
