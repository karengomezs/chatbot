import { chatbotPrompt } from "@/app/helpers/constants/chatbot-prompt";
import { ChatGPTMessage, OpenAIStream } from "@/lib/openai-stream";
import { MessageArraySchema } from "@/lib/validators/message";

export async function POST(req: Request) {
  //al parámetro llega la solicitud, el body del otro lado
  const { message } = await req.json();

  const parseMessages = MessageArraySchema.parse(message); //zod compara que la información que recibe es igual en estructura y tipos

  const outboundMessages: ChatGPTMessage[] = parseMessages.map((message) => ({
    role: message.isUserMessage ? "user" : "system",
    content: message.text,
  }));

  outboundMessages.unshift({
    role: "system",
    content: chatbotPrompt,
  });

  //esto es el objeto que debo enviarle a openai https://platform.openai.com/docs/api-reference/chat/create
  const payload = {
    model: "gpt-3.5-turbo",
    messages: outboundMessages,
    temperature: 0.4,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 150,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);

  //esto es la respuesta de la funcion para que luego yo la consuma en el cliente
  return new Response(stream);
}
