import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(token: string) {
  socket = io("http://localhost:3001", {
    auth: { token },
    autoConnect: true,
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
}
