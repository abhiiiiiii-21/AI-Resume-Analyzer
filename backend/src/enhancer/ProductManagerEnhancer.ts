import { BaseRoleEnhancer } from "./BaseRoleEnhancer";

/**
 * OOP — Inheritance: Extends BaseRoleEnhancer, gets enhance() for free.
 *
 * SOLID — O (Open/Closed): This new role was added by creating this ONE file.
 * BaseRoleEnhancer was never modified.
 */
export class ProductManagerEnhancer extends BaseRoleEnhancer {
    getRoleName(): string {
        return "Product Manager";
    }

    protected getRoleContext(): string {
        return `Role focus: Product Manager.
Please emphasize the following in the resume:
- Product launches and go-to-market strategies
- User metrics: DAU, MAU, retention, conversion rates
- A/B testing results and data-driven decisions
- Cross-functional team leadership
- Revenue and growth impact (e.g. "grew revenue by 30% in Q2")`;
    }
}
