// import { useSearchParams } from "react-router-dom"
import {io,Socket} from "socket.io-client"
import {useState,useEffect,useRef} from "react"


const URL = "http://localhost:3000"
export const Room = ({
    name,
    localAudioTrack,
    localVideoTrack
}:{name:string,
    localAudioTrack:MediaStreamTrack|null,
    localVideoTrack:MediaStreamTrack|null
}) => {

    // const [searchParams, setSearchParams] = useSearchParams()  
    const [lobby,setLobby]  = useState(true)
    const [socket,setSocket] = useState<Socket|null>(null)
    
    const [sendingPc,setSendingPc] = useState<RTCPeerConnection|null>(null)
    const [receivingPc,setReceivingPc] = useState<RTCPeerConnection|null>(null)
    
    const [remoteAudioTrack,setRemoteAudioTrack] = useState<MediaStreamTrack|null>(null)
    const [remoteVideoTrack,setRemoteVideoTrack] = useState<MediaStreamTrack|null>(null)
    
    const [remoteMediaStream,setRemoteMediaStream]  = useState<MediaStream|null>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)
    const localVideoRef = useRef<HTMLVideoElement>(null)
    



    useEffect(()=>{
        console.log(1)
        const socket = io(URL);

    // Sending answer
    socket.on("send-offer",({roomId})=>{
        setLobby(false)
        console.log("sending offer")    
        const pc = new RTCPeerConnection();
        console.log("init rtc")
        setSendingPc(pc)
        if (localAudioTrack){
            pc.addTrack(localAudioTrack)}
        if(localVideoTrack){
            pc.addTrack(localVideoTrack)}
        console.log("added track")  

        pc.onicecandidate = async (e)=>{
            console.log("oniceCandidate")
            if(e.candidate){
                console.log(e.candidate)
                socket.emit("add-ice-candidates",({
                    candidate:e.candidate,
                    type:"sender",
                    roomId}))
            }
        } 
        pc.onnegotiationneeded = async () => {
            console.log("on negotiation neeeded, sending offer");
            const sdp = await pc.createOffer();
            //@ts-ignore
            pc.setLocalDescription(sdp)
            socket.emit("offer", {
                sdp,
                roomId
            })
        }

    })
    

    // Receiving offer
    socket.on("offer",async ({roomId,sdp:remoteSdp})=>{
        console.log("received offer")
        setLobby(false)
        const pc = new RTCPeerConnection()
        pc.setRemoteDescription(remoteSdp)
        const sdp = await pc.createAnswer()
        const stream = new MediaStream()
        pc.setLocalDescription(sdp)
        console.log(sdp)
        if (remoteVideoRef.current){
            remoteVideoRef.current.srcObject = stream
        }
        //window.pcr = pc;
        setReceivingPc(pc)
        
        setRemoteMediaStream(stream)
        pc.onicecandidate = async  (e) => {
            if(!e.candidate){
                return;
            }
            console.log("add ice candidate on receiver side")
            socket.emit("add-ice-candidates",(
                {candidate:e.candidate,type:"reciever",roomId}
            ))
        }
        setReceivingPc(pc)
        // pc.ontrack = (({track,type}) =>{
        //     if(type== "audio"){
        //         // setRemoteAudioTrack(track)
        //         //@ts-ignore
        //         remoteVideoRef.current?.srcObject.addTrack(track)
        //     }
        //     else{
        //         // setRemoteVideoTrack(track)
        //         //@ts-ignore
        //         remoteVideoRef.current?.srcObject.addTrack(track)
        //     }
        // })
        socket.emit("answer",{
            roomId,
            sdp
        })

        setTimeout(()=>{
            const track1 = pc.getTransceivers()[0].receiver.track
            const track2 = pc.getTransceivers()[1].receiver.track

            if(track1.kind === "video"){
                setRemoteAudioTrack(track2)
                setRemoteVideoTrack(track1)
            }
            else{
                setRemoteVideoTrack(track2)
                setRemoteAudioTrack(track1)
            }
            if(!remoteVideoRef.current){
                return
            }
            //@ts-ignore
            remoteVideoRef.current.srcObject?.addTrack(track1)
            //@ts-ignore
            remoteVideoRef.current.srcObject?.addTrack(track2)
            remoteVideoRef.current.play()
        },5000)
    })
    
    // Recieving Answer
    socket.on("answer",({roomId,sdp:remoteSdp,socketId})=>{
        console.log("recieved answer",socketId)
        setLobby(false)
        console.log(remoteSdp)
        setSendingPc(pc=>{
            
            pc?.setRemoteDescription(remoteSdp)
            return pc
        })

    })
    socket.on("lobby",()=>
        setLobby(true)
    )   

    socket.on("add-ice-candidates",({candidate,type}) =>{
        if(type === "sender"){
            console.log("recieved  sender ice candidates")
            setReceivingPc(pc=>{
                pc?.addIceCandidate(candidate)
                return pc
            })
        }else{
            console.log("received receiver ice candidates")
            setSendingPc(pc =>{
                
                pc?.addIceCandidate(candidate)
                return pc
            })
        }
    })
    setSocket(socket);
    },[name])
    
    useEffect(()=>{
        if(localVideoRef.current && localVideoTrack){
            localVideoRef.current.srcObject = new MediaStream([localVideoTrack])
            localVideoRef.current.play()
        }
    },[localVideoRef])
    if(lobby){
        return(
            <div>
                waiting for someone to connect
                <video autoPlay ref={localVideoRef} ></video>
            </div>
        )
    }
    return (
        
        <div>
            hii {name}
            <video autoPlay ref={localVideoRef} ></video>
            <video autoPlay ref ={remoteVideoRef}></video>
        </div>
    )
}