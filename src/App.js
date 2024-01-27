import logo from './logo.svg';
import './App.scss';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/dashboard' element={<Dashboard />}>
          </Route>
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
  );
}

export default App;
