import { BaseRoleEnhancer } from "./BaseRoleEnhancer";
 
/**
 * OOP — Inheritance: Extends BaseRoleEnhancer, gets enhance() for free.
 *
 * SOLID — O (Open/Closed): This new role was added by creating this ONE file.
 * BaseRoleEnhancer was never modified.
 *
 * Show this file to your examiner as proof of Open/Closed Principle —
 * a completely new role, zero changes to any existing file.
 */
export class DataScientistEnhancer extends BaseRoleEnhancer {
  getRoleName(): string {
    return "Data Scientist";
  }
 
  protected getRoleContext(): string {
    return `Role focus: Data Scientist.
Please emphasize the following in the resume:
- Machine learning models built and deployed
- Python, R, SQL, and data pipeline experience
- Statistical analysis and experimentation
- Model accuracy improvements (e.g. "improved model F1 score by 15%")
- Business impact of data insights`;
  }
}
 