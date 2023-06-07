export type ChatGPTAgent = "user" | "system";

export interface ChatGPTMessages {
  role: ChatGPTAgent;
  content: string;
}
