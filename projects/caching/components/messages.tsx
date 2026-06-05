import { Message } from "@/lib/messages";

interface Props {
  messages: Message[];
}
export default function Messages({ messages }: Props) {
  return (
    <ul className="messages">
      {messages.map((message) => (
        <li key={message.id}>{message.text}</li>
      ))}
    </ul>
  );
}
