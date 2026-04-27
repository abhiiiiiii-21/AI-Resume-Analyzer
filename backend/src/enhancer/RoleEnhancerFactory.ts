import { IAIProvider } from "../interfaces/IAIProvider";
import { BaseRoleEnhancer } from "./BaseRoleEnhancer";
import { SoftwareEngineerEnhancer } from "./SoftwareEngineerEnhancer";
import { ProductManagerEnhancer } from "./ProductManagerEnhancer";
import { DataScientistEnhancer } from "./DataScientistEnhancer";

/**
 * SOLID — O (Open/Closed): You can add new roles without changing existing code.
 *
 * OOP — Factory Method Pattern: Centralizes the creation of complex objects.
 *                                ResumeService doesn't care HOW an enhancer is built.
 */
export class RoleEnhancerFactory {
  static create(role: string, aiProvider: IAIProvider): BaseRoleEnhancer {
    switch (role.toLowerCase()) {
      case "software-engineer":
        return new SoftwareEngineerEnhancer(aiProvider);
      case "product-manager":
        return new ProductManagerEnhancer(aiProvider);
      case "data-scientist":
        return new DataScientistEnhancer(aiProvider);
      default:
        throw new Error(`Unsupported role: ${role}. Supported: software-engineer, product-manager, data-scientist.`);
    }
  }

  static getAvailableRoles(): string[] {
    return ["software-engineer", "product-manager", "data-scientist"];
  }
}

export default RoleEnhancerFactory;
