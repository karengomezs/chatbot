import { chatbotPrompt } from "@/app/helpers/constants/chatbot-prompt";
import { ChatGPTMessages } from "@/lib/openai-stream";
import { MessageArraySchema } from "@/lib/validators/message";

export async function POST(req: Request) {
  //al parámetro llega la solicitud, el body del otro lado
  const { message } = await req.json();

  const parseMessages = MessageArraySchema.parse(message); //zod compara que la información que recibe es igual en estructura y tipos

  const outboundMessages: ChatGPTMessages[] = parseMessages.map((message) => ({
    role: message.isUserMessage ? "user" : "system",
    content: message.text,
  }));

  outboundMessages.unshift({
    role: "system",
    content: chatbotPrompt,
  });
}
