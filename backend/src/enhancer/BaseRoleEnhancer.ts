import { IAIProvider } from "../interfaces/IAIProvider";
 
/**
 * SOLID — O (Open/Closed Principle)
 *
 * This class is:
 * - CLOSED for modification → you never edit this file to add a new role
 * - OPEN for extension → you create a new class that extends this
 *
 * OOP — Abstraction: Defines the common template all role enhancers must follow.
 *
 * OOP — Inheritance: SoftwareEngineerEnhancer, ProductManagerEnhancer,
 *                    DataScientistEnhancer all extend this class.
 *
 * OOP — Polymorphism: RoleEnhancerFactory returns BaseRoleEnhancer type.
 *                     The caller just calls .enhance() and it works
 *                     differently depending on which subclass it is.
 */

export abstract class BaseRoleEnhancer {
  // D principle — depends on IAIProvider interface, not GroqAIProvider directly
  constructor(protected aiProvider: IAIProvider) {}
 
  async enhance(resumeText: string, jobDescription: string): Promise<string> {
    const enrichedJobDescription = `${this.getRoleContext()}\n\n${jobDescription}`;
    return this.aiProvider.enhance(resumeText, enrichedJobDescription);
  }
 
  abstract getRoleName(): string;
 
  protected abstract getRoleContext(): string;
}
 