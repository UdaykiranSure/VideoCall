import { Server, Socket } from  "socket.io";
import {UserManger} from "./managers/userManager.js"
import http from 'http';
const server = http.createServer(http)

const io = new Server(server,{
    cors:{
        origin:"*"
    }
})

const userManager = new UserManger();
io.on("connection",   (socket: Socket) =>{
    console.log("a user connected")
    userManager.addUser("randomNamer",socket)

})
io.on("disconnection",(socketId)=>{
    console.log("a user disconnected")
    userManager.removeUser(socketId)
}

)

server.listen(3000,()=>{
    console.log('server listening on port 3000')
})