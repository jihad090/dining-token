import { io, Socket } from 'socket.io-client';

export const socket: Socket = io('https://dining-token.onrender.com', {
    transports: ['websocket', 'polling'], 
    withCredentials: false,
    autoConnect: false, 
});