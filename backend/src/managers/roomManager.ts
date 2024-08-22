import { Socket } from "socket.io";
import { User } from "./userManager";
let GLOBAL_ROOM_ID  = 1
interface Room{
    user1:User;
    user2:User;
}
export class RoomManager{
    private rooms:Map<String,Room>
    constructor(){
        this.rooms = new Map<String,Room>()
     }

     creatRoom(user1:User,user2:User){
        const roomId = this.generateId().toString();
        this.rooms.set(roomId,{
            user1,
            user2
        })
        console.log("creating room")

        user1.socket.emit("send-offer",{
            roomId
        })
        setTimeout(()=>{
            user2.socket.emit("send-offer",{
                roomId
            })
        },5000)
        
        
     }

     onOffer(roomId:String,sdp:String,socketId:String){
        console.log("sending offer to user2",sdp)
        console.log(roomId)
        const room = this.rooms.get(roomId)
        const receivingUser = room?.user1.socket.id === socketId? room?.user2 : room?.user1
        receivingUser?.socket.emit("offer",{
            roomId,
            sdp
        })
     }

     onAnswer(roomId:String,sdp:String,socketId:String){
        console.log(sdp)
        const room = this.rooms.get(roomId)
        const receivingUser = room?.user1.socket.id === socketId? room?.user2 : room?.user1
        console.log(receivingUser,"sending answert o user 1")
        receivingUser?.socket.emit("answer",{
            roomId,
            sdp,
            socketId: receivingUser.socket.id
        })
     }

     onIceCandidates(roomId:string,socketId:string,candidate:any,type:"sender"|"receiver"){
        const room = this.rooms.get(roomId)
        const receivingUser = room?.user1.socket.id === socketId? room?.user2 : room?.user1
        receivingUser?.socket.emit("add-ice-candidates",({candidate,type}))
     }

     generateId(){
        return GLOBAL_ROOM_ID++;
     }
}