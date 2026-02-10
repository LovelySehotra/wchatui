import { writable } from "svelte/store";

export type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
};

export const chats = writable<Chat[]>([
  {
    id: "1",
    name: "John",
    lastMessage: "Hey 👋",
    lastTime: "10:30",
    unreadCount: 2
  }
]);

// ✅ THIS WAS MISSING
export const activeChat = writable<Chat | null>(null);
