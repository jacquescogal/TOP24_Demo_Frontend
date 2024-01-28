import React, { useEffect, useState } from 'react'
import style from './Aphrodite.module.scss'
import { toast } from 'react-toastify'
import axios from 'axios'
import { VscDebugRestart } from "react-icons/vsc";
import { FaExchangeAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
const AphroditeDisguised = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        
    ])

    const [choices, setChoices] = useState([
    ])

    const [choicesSelected, setChoicesSelected] = useState([]) //list of strings

    const [done,setDone] = useState(false);
    // const host='https://top24-backend-demo.onrender.com'
    const host=process.env.REACT_APP_BACKEND

    useEffect(()=>{
        const token=localStorage.getItem('token')
        axios.get(host+'/user/check_token', {
    headers: {
        'Authorization': `${token}`
    }
    })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        toast.error('Invalid or expired token')
        navigate('/')
        console.error('There was an error!', error);
    });
    },[])
    useEffect(()=>{
        axios.post(host+'/talk',{
            choiceList:[],
            god:'aphrodite',
            state:'disguised'
        }).then((res)=>{
            console.log(res.data);
            setMessages([{role:'Deity',message:res.data.message}]);

            const choicesList = Object.entries(res.data.choices).map(([choice_key, choice_info]) => ({
                choice_key,
                choice_info
            }));

            setChoices(choicesList);
            console.log(choices)
        }
        ).catch((err)=>{
            console.log(err);
        })
    },[])


    const submitChoice = async (choice_key) => {
        const updatedChoicesSelected = [...choicesSelected, choice_key];
        setChoicesSelected(updatedChoicesSelected);
        setChoices([])
        setMessages(messages=>[...messages,{role:'Player',message:choices.find(choice=>choice.choice_key===choice_key).choice_info}]);
        //wait for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));

        const payload = {
            choiceList: updatedChoicesSelected,
            god:'aphrodite',
            state:'disguised'
        }
        axios.post(host+'/talk',payload).then((res)=>{
            console.log(res.data);
            setMessages(messages=>[...messages,{role:'Deity',message:res.data.message}]);
            console.log(messages)

            const choicesList = Object.entries(res.data.choices).map(([choice_key, choice_info]) => ({
                choice_key,
                choice_info
            }));

            setChoices(choicesList);
            if (choicesList.length===0){
                setDone(true);
            }
            else{
                setDone(false);
            }
        }
        ).catch((err)=>{
            console.log(err);
        })
    }

    const restart = async () => {
        const updatedChoicesSelected = [];
        setChoicesSelected(updatedChoicesSelected);
        setDone(false);
        axios.post(host+'/talk',{
            choiceList:[],
            god:'aphrodite',
            state:'disguised'
        }).then((res)=>{
            console.log(res.data);
            setMessages([{role:'Deity',message:res.data.message}]);

            const choicesList = Object.entries(res.data.choices).map(([choice_key, choice_info]) => ({
                choice_key,
                choice_info
            }));

            setChoices(choicesList);
            console.log(choices)
        }
        ).catch((err)=>{
            console.log(err);
        })
    }
    const switchState = async () => {
        navigate('/aphrodite')
    }

  return (
    <div className={style.Holder}>
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
                        <div className={style.ChoiceText} onClick={e=>{submitChoice(choice.choice_key)}}>{choice.choice_info}</div>
                    </div>
                )
            })}
            </div>
            {done===true && <div className={style.Restart} onClick={restart}>
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