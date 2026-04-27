import { BaseRoleEnhancer } from "./BaseRoleEnhancer";
 
/**
 * OOP — Inheritance: Extends BaseRoleEnhancer, gets enhance() for free.
 *
 * SOLID — O (Open/Closed): This new role was added by creating this ONE file.
 * BaseRoleEnhancer was never modified.
 */
export class SoftwareEngineerEnhancer extends BaseRoleEnhancer {
  getRoleName(): string {
    return "Software Engineer";
  }
 
  protected getRoleContext(): string {
    return `Role focus: Software Engineer.
Please emphasize the following in the resume:
- Programming languages, frameworks, and tools
- System design and architecture experience
- Scalability and performance improvements
- Open source contributions
- Quantified engineering impact (e.g. "reduced load time by 60%")`;
  }
}
 