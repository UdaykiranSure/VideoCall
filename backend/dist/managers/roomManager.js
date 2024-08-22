"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
let GLOBAL_ROOM_ID = 1;
class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    creatRoom(user1, user2) {
        const roomId = this.generateId().toString();
        this.rooms.set(roomId, {
            user1,
            user2
        });
        console.log("creating room");
        user1.socket.emit("send-offer", {
            roomId
        });
        setTimeout(() => {
            user2.socket.emit("send-offer", {
                roomId
            });
        }, 5000);
    }
    onOffer(roomId, sdp, socketId) {
        console.log("sending offer to user2", sdp);
        console.log(roomId);
        const room = this.rooms.get(roomId);
        const receivingUser = (room === null || room === void 0 ? void 0 : room.user1.socket.id) === socketId ? room === null || room === void 0 ? void 0 : room.user2 : room === null || room === void 0 ? void 0 : room.user1;
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit("offer", {
            roomId,
            sdp
        });
    }
    onAnswer(roomId, sdp, socketId) {
        console.log(sdp);
        const room = this.rooms.get(roomId);
        const receivingUser = (room === null || room === void 0 ? void 0 : room.user1.socket.id) === socketId ? room === null || room === void 0 ? void 0 : room.user2 : room === null || room === void 0 ? void 0 : room.user1;
        console.log(receivingUser, "sending answert o user 1");
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit("answer", {
            roomId,
            sdp,
            socketId: receivingUser.socket.id
        });
    }
    onIceCandidates(roomId, socketId, candidate, type) {
        const room = this.rooms.get(roomId);
        const receivingUser = (room === null || room === void 0 ? void 0 : room.user1.socket.id) === socketId ? room === null || room === void 0 ? void 0 : room.user2 : room === null || room === void 0 ? void 0 : room.user1;
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit("add-ice-candidates", ({ candidate, type }));
    }
    generateId() {
        return GLOBAL_ROOM_ID++;
    }
}
exports.RoomManager = RoomManager;
