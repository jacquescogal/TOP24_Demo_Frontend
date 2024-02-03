import React, { useEffect, useRef, useState } from 'react'
import style from './Aphrodite.module.scss'
import { toast } from 'react-toastify'
import { VscDebugRestart } from 'react-icons/vsc'
import { FaExchangeAlt } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import CountdownCircle from '../../components/countdown/Countdown'

const AphroditeDisguised = () => {
    const navigate = useNavigate()
    const [messages, setMessages] = useState([
        
    ])

    const [choices, setChoices] = useState([
    ])
    
    const [roomToken,setRoomToken] = useState(null)
    const [done,setDone] = useState(false);
    const [showResult,setShowResult] = useState(false)
    const [result,setResult] = useState({
        1:1,
        2:2
    })
    const [connectCount,setConnectCount] = useState(0)
    const [timeLeft,setTimeLeft] = useState(0)
    const [totalTime,setTotalTime] = useState(15000)
    const ws = useRef(null);
    const ws_host=process.env.REACT_APP_WS_BACKEND
    const host=process.env.REACT_APP_BACKEND
    const headers={headers:
    {
        'Authorization':localStorage.getItem('token')
    }}
    

    useEffect(()=>{
        const token=localStorage.getItem('token')
        axiosInstance.get(host+'/user/check_token', headers)
    .then(response => {
        console.log(response.data.message);
    })
    .catch(error => {
        toast.error('Invalid or expired token')
        navigate('/')
        console.error('There was an error!', error);
    });
    },[])

    useEffect(()=>{
        
        const payload={
          god:'aphrodite',
          state:'disguised'
        }
        const get_token = async () => {
          try{
            const response = await axiosInstance.post(host+'/talk/get_token',payload,{headers:{
              'Authorization':localStorage.getItem('token')
          }})
          if (response.status === 200) {
            setRoomToken('Bearer ' + response.data.token);
            console.log('Success: Room token set')
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
                sendPing()
          };
          ws.current.onmessage = (event) => {
              const data = JSON.parse(event.data);
              if (data.type==='pong' || data.type=='start_room'){
                setConnectCount(data.user_count);
                setTotalTime(data.total_time);
                setMessages(data.history);
                setChoices(data.choices);
                if (data.status==='done') setDone(true);
                else setDone(false);
        }
        else if (data.type==='show_vote'){
            setConnectCount(data.user_count);
            setResult(data.choice_count);
            setShowResult(true);
            setTimeout(()=>{
                setMessages(data.history.splice(0,data.history.length-1));
                setChoices([]);
                setShowResult(false);
            },1000)
            
            console.log(data.choice_count)
        }
        else if(data.type==='user_update'){
            setConnectCount(data.user_count);
        }
          if ('time_left' in data) setTimeLeft(data.time_left); 
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

      useEffect(()=>{

        if (!ws.current && ws.current?.readyState !== WebSocket.OPEN) {
            console.log('bug')
            return;
        }
      },[ws.current])

      //function that sends a message after timeleft
      const sendPing = async () => {
        const payload = {
            type: 'ping',
            stage:Math.floor(messages.length/2)
        };
        sendMessage(payload);
        };

      const sendMessage = (message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify(message));
        } else {
          console.error("WebSocket is not open.");
        }
      };
    
    
    const switchState = async () => {
        navigate('/aphrodite')
    }
  return (
    <div className={style.Holder}>
        <CountdownCircle milliseconds={timeLeft} totalTime={totalTime} sendPing={sendPing} setChoices={{}}/>
        <h2 className={style.UserCount}>Users:{connectCount}</h2>
        <div className={style.ConversationHolder}>
            <div className={style.ConversationBackdrop}/>
            {messages.map((message, index) => {
                return (
                    <div key={index} className={`${style.Message} ${style[message.role]}`}>
                        
                        <div >{message.message}</div>
                    </div>
                )
            })}
            
        </div>
        <div className={style.ChoiceHolder}>
        {choices.map((choice, index) => {
                return (
                    
                    <div key={index} className={style.Choice}>
                    {showResult && <div className={style.ResultCircle}>{result[choice.choice_key]||0}</div>}
                        <div className={style.ChoiceText} onClick={e=>{sendMessage({
                            type:'choice',
                            choice:choice.choice_key,
                            stage:Math.floor(messages.length/2)
                        })}}>{choice.description}</div>
                    </div>
                )
            })}
            </div>
            {done===true && <div className={style.Restart} onClick={e=>{
                sendMessage({
                    type:'restart'
                })
            }}>
            <VscDebugRestart color='white' size={28} />
            </div>}
            <div className={style.Switcher} onClick={switchState}>
            <FaExchangeAlt color='white' size={28}/>
            </div>
            <img className={style.Backdrop} src="https://images.unsplash.com/photo-1612979128493-42f7790b7ae4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/>
    </div>
  )
}

export default AphroditeDisguised