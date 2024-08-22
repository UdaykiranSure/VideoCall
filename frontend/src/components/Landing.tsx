import { useState,useRef,useEffect } from "react"
import { Room } from "./Room";

export const Landing = () =>{
    const [name,setName] = useState("")
    const [joined,setJoined] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null)
    const [localVideoTrack,setlocalVideoTrack] = useState<MediaStreamTrack|null>(null)
    const [localAudioTrack,setLocalAudioTrack] = useState<MediaStreamTrack|null>(null)

    const getCam = async ()=>{
        const stream = window.navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
        })
        const audioTrack = (await stream).getAudioTracks()[0]
        const videoTrack = (await stream).getVideoTracks()[0]
        setLocalAudioTrack(audioTrack)
        setlocalVideoTrack(videoTrack)
        if(!videoRef.current){
            return
        }
        videoRef.current.srcObject = new MediaStream([videoTrack])
        videoRef.current.play()
    }
    useEffect(() => {
        if (videoRef && videoRef.current) {
            getCam()
        }
    }, [videoRef]);
    
    if(!joined){
        return <div>
        <video  autoPlay ref={videoRef}></video>
        <input type="text" placeholder="Enter your Name" 
        onChange={(event) => setName(event.target.value)}
         />
         <button  onClick={() =>{
            setJoined(true)
         }}> Join</button>
    </div>
    }
   
    return (<Room name = {name} localAudioTrack = {localAudioTrack} localVideoTrack = {localVideoTrack} />)
}