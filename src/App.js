 import { useEffect} from 'react';
import './App.css';
import { useLocalState } from './util/useLocalStorage';
import {Routes,Route} from "react-router-dom";
import Dashboard from './Dashboard';
import HomePage from './HomePage';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import PaperSubmit from './PaperView';
import PaperView from './PaperView/index2';
import PaperEdit from './PaperView/index1';



function App() {

  const [jwt,setJwt] = useLocalState("","jwt")

  return (
    <Routes>
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard/>
        </PrivateRoute>
      }/>
      <Route path ="/papers/:id" element={
        <PrivateRoute>
          <PaperSubmit/>
        </PrivateRoute>
      }/>
        <Route path ="/papers/:id/view" element={
        <PrivateRoute>
        <PaperView/>
        </PrivateRoute>
      }/>
        <Route path ="/papers/:id/edit" element={
        <PrivateRoute>
        <PaperEdit/>
        </PrivateRoute>
      }/>



      <Route path="/login" element={<Login/>}/>
      <Route path="/" element={<HomePage/>}/>
    </Routes>
  );
}

export default App;
