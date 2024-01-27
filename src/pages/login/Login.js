import React from 'react'
import style from './Login.module.scss'
import LoginForm from '../../components/loginform/LoginForm'
const Login = () => {
  return (
    <div className={style.Holder}>
        <LoginForm />
        <img className={style.Backdrop} src="https://images.unsplash.com/photo-1529154166925-574a0236a4f4?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/>
    </div>
  )
}

export default Login