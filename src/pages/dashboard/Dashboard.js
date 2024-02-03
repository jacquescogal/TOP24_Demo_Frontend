import axios from 'axios'
import React, { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/axiosInstance'

const Dashboard = () => {
  const [connectCount,setConnectCount] = React.useState(0)
  const [roomToken,setRoomToken] = React.useState(null)
  const [timeLeft,setTimeLeft] = React.useState(0)
  const ws = useRef(null);
  const ws_host=process.env.REACT_APP_WS_BACKEND
  const host=process.env.REACT_APP_BACKEND
  useEffect(()=>{
    const payload={
      god:'aphrodite',
      state:'normal'
    }
    const get_token = async () => {
      try{
        const response = await axiosInstance.post(host+'/talk/get_token',payload,{headers:{
          'Authorization':localStorage.getItem('token')
      }})
      if (response.status === 200) {
        setRoomToken('Bearer ' + response.data.token);
      }
      else{
        toast.error('Invalid or expired token')
      }
    }
    catch (error) {
      toast.error('Invalid or expired token')
    }

  }
  get_token()
  },[])

  useEffect(()=>{
    if (roomToken===null) return
    try {
      ws.current = new WebSocket(ws_host+`/talk/connect/?room_token=${roomToken}`);
      ws.current.onopen = () => {
          console.log("Connected to WebSocket");
      };
      ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type==='user_update'){
            if ('user_count' in data) setConnectCount(data.user_count);
            if ('time_left' in data) setTimeLeft(data.timer); 
          }
          else if (data.type==='pong'){
            console.log(data)
          }
          console.log(data)
      };

      ws.current.onerror = (error) => {
          console.error("WebSocket Error: ", error);
      };

      ws.current.onclose = () => {
        toast.error('WebSocket connection closed')

      };

      return () => {
        if (ws.current) {
          ws.current.close();
          ws.current = null;
        }
      };
  } catch (error) {
      console.error("Error connecting to WebSocket: ", error);
  }
  },[roomToken])
  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      console.error("WebSocket is not open.");
    }
  };
  return (
    <div>Dashboard
      <button onClick={()=>{sendMessage(JSON.stringify({
        type:'ping',
        stage:0
        }))}}></button>
      <h1>{connectCount}</h1>
      <h1>{timeLeft}</h1>
    </div>
  )
}

export default Dashboard