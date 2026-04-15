// SRP: Dedicated class only responsible for transforming raw text
export class TextProcessor {
  normalize(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9+#.\s]/g, ' ');
  }

  tokenize(text: string): string[] {
    return this.normalize(text)
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 1);
  }

  tokenizeUnique(text: string): Set<string> {
    return new Set(this.tokenize(text));
  }
}
