import { Socket } from "socket.io";
export interface User {
    socket: Socket;
    name: String;
}
export declare class UserManger {
    private users;
    private queue;
    private roomManager;
    constructor();
    addUser(name: String, socket: Socket): void;
    removeUser(socketId: String): void;
    clearQueue(): void;
    initHandlers(socket: Socket): void;
}
