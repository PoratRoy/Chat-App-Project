import io from 'socket.io-client';
import { createContext } from 'react';
const CONNECTION_PORT = "https://localhost:5000/"

export const socket = io(CONNECTION_PORT);
export const SocketContext = createContext();
