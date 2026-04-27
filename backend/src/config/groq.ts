import Groq from "groq-sdk";

class GroqClient {
  private static instance: Groq;

  static getInstance(): Groq {
    if (!GroqClient.instance) {
      GroqClient.instance = new Groq({
        apiKey: process.env.GROQ_API_KEY!,
      });
    }
    return GroqClient.instance;
  }
}

const groq = GroqClient.getInstance();

export default groq;