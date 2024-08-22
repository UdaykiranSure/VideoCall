"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManger = void 0;
const roomManager_1 = require("./roomManager");
class UserManger {
    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new roomManager_1.RoomManager();
    }
    addUser(name, socket) {
        this.users.push({
            name, socket
        });
        this.queue.push(socket.id);
        socket.send("lobby");
        this.clearQueue();
        this.initHandlers(socket);
    }
    removeUser(socketId) {
        this.users.filter((x) => { x.socket.id !== socketId; });
        this.queue.filter((x) => { x === socketId; });
    }
    clearQueue() {
        console.log("le");
        console.log(this.queue.length);
        if (this.queue.length < 2) {
            return;
        }
        const id1 = this.queue.pop();
        const id2 = this.queue.pop();
        console.log(id1, id2);
        const user1 = this.users.find(x => x.socket.id == id1);
        const user2 = this.users.find(x => x.socket.id == id2);
        console.log(user1, user2);
        if (!user1 || !user2) {
            return;
        }
        const room = this.roomManager.creatRoom(user1, user2);
        this.clearQueue();
    }
    initHandlers(socket) {
        socket.on("offer", ({ roomId, sdp }) => {
            console.log("in init Handler offer");
            this.roomManager.onOffer(roomId, sdp, socket.id);
        });
        socket.on("answer", ({ roomId, sdp }) => {
            console.log("in init Handler answer");
            this.roomManager.onAnswer(roomId, sdp, socket.id);
        });
        socket.on("add-ice-candidates", ({ roomId, candidate, type }) => {
            this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
        });
    }
}
exports.UserManger = UserManger;
