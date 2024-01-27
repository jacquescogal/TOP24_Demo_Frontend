import React from 'react'
import style from './LoginForm.module.scss'
import axios from 'axios';
const LoginForm = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [team, setTeam] = React.useState('Zagreus');
    //use axios to send to /user/login at https://top24-backend-demo.onrender.com/

    const handleSubmit = (event) => {
        event.preventDefault(); 
        console.log(username);
        console.log(password);
        const payload = {
            username: username,
            password: password
        }
        console.log('test')
        axios.post('https://top24-backend-demo.onrender.com/user/login', payload).then((res) => {
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        }
        )
    }

    const handleRegisterSubmit = (event) => {
        event.preventDefault(); 
        console.log(username);
        console.log(password);
        console.log(team);
        const payload = {
            username: username,
            password: password,
            team_name: team
        }
        axios.post('https://top24-backend-demo.onrender.com/user/register', payload).then((res) => {
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        }
        )
    }


  return (
    <div className={style.Holder}>
        
        <div className={style.Form}>
            <h1>Login (Demo)</h1>
            <form id='loginForm' onSubmit={e=>{e.preventDefault()}}>
                <div className={style.Input}>
                    <div htmlFor="username"className={style.InputLabel}>Username: </div>
                    <input type="text" id="usernmae" name="username" placeholder="Username" className={style.InputBox} value={username} onChange={e=>setUsername(e.target.value)}/>
                </div>
                <div className={style.Input}>
                    <div htmlFor="password"className={style.InputLabel}>Password: </div>
                    <input type="password" id="password" name="password" placeholder="Password" className={style.InputBox} value={password} onChange={e=>setPassword(e.target.value)}/>
                </div>
                <div className={style.Input}>
                    <div htmlFor="team" className={style.InputLabel}>Team: </div>
                    <select id="team" name="team" value={team} onChange={e=>setTeam(e.target.value)} className={style.InputBox}>
                        <option value="Hercules">Hercules</option>
                        <option value="Perceus">Perceus</option>
                        <option value="Zagreus">Zagreus</option>
                    </select>
                </div>
                <div className={style.Submit} onClick={handleSubmit}>
                    Submit
                </div>
                <div className={style.Submit} onClick={handleRegisterSubmit}>
                    Register
                </div>
            </form>
        </div>
        <div className={style.Backdrop}/>
    </div>
  )
}

export default LoginForm;