"use client";

import { io } from "socket.io-client";

export const socket = io("https://13682ac4.app.deploy.tourde.app", {
  path: "/socket.io",
  addTrailingSlash: false,
  transports: ['polling', 'websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});