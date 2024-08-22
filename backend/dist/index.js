"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const userManager_js_1 = require("./managers/userManager.js");
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(http_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*"
    }
});
const userManager = new userManager_js_1.UserManger();
io.on("connection", (socket) => {
    console.log("a user connected");
    userManager.addUser("randomNamer", socket);
});
io.on("disconnection", (socketId) => {
    console.log("a user disconnected");
    userManager.removeUser(socketId);
});
server.listen(3000, () => {
    console.log('server listening on port 3000');
});
