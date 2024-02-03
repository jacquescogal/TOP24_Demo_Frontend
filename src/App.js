import logo from './logo.svg';
import './App.scss';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Aphrodite from './pages/aphrodite/Aphrodite';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AphroditeDisguised from './pages/aphroditeDisguised/AphroditeDisguised';


function App() {
  return (
    <>
    <Router>
    <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/aphrodite' element={<Aphrodite />}/>
        <Route path='/aphrodite_disguised' element={<AphroditeDisguised />}/>
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
    </Routes>
    </Router>
    </>
  );
}

export default App;
