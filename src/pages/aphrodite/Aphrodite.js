import React, { useEffect, useState } from 'react'
import style from './Aphrodite.module.scss'
import { toast } from 'react-toastify'
import axios from 'axios'

const Aphrodite = () => {
    const [messages, setMessages] = useState([
        
    ])

    const [choices, setChoices] = useState([
    ])

    const [choicesSelected, setChoicesSelected] = useState([]) //list of strings

    const host='https://top24-backend-demo.onrender.com'
    // const host='http://localhost:8000'
    useEffect(()=>{
        axios.post(host+'/talk',{
            choiceList:[]
        }).then((res)=>{
            console.log(res.data);
            setMessages([{role:'deity',message:res.data.message}]);

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
            choiceList: updatedChoicesSelected
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
            console.log(choices)
        }
        ).catch((err)=>{
            console.log(err);
        })
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
        <img className={style.Backdrop} src="https://images.unsplash.com/photo-1532698995422-ac0f009ade44?q=80&w=2971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/>
    </div>
  )
}

export default Aphrodite