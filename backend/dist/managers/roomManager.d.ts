import { User } from "./userManager";
export declare class RoomManager {
    private rooms;
    constructor();
    creatRoom(user1: User, user2: User): void;
    onOffer(roomId: String, sdp: String, socketId: String): void;
    onAnswer(roomId: String, sdp: String, socketId: String): void;
    onIceCandidates(roomId: string, socketId: string, candidate: any, type: "sender" | "receiver"): void;
    generateId(): number;
}
