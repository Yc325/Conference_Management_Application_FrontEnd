import { useEffect, useState} from 'react';
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
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from "jwt-decode";
import ReviwerDashboard from './ReviewerDashboard';
import ConfChairDashboard from './ConfChairDashboard';
import SysAdminDashboard from './SysAdminDashboard';
import PaperViewReviewer from './PaperViewReviewer';
import PaperViewConfChair from './PaperViewConfChair';


function App() {

  const [jwt,setJwt] = useLocalState("","jwt")
  const [roles,setRoles] = useState(getRolesFromJWT())


function getRolesFromJWT (){
 // get role from jwt and assign via setRole()
 if(jwt){
 const decodeJwt = jwt_decode(jwt)
 return decodeJwt.authorities
 }
 return [];
}

  return (
    <Routes>
<Route path="/dashboard" element={
  roles.find((role)=> role === "ROLE_REVIEWER") ? (
    <PrivateRoute>
      <ReviwerDashboard/>
    </PrivateRoute>
  ) : roles.find((role)=> role  === "ROLE_CONF_CHAIR") ? (
    <PrivateRoute>
      <ConfChairDashboard/>
    </PrivateRoute>
  ) : roles.find((role)=> role  ==="ROLE_SYS_ADMIN") ?
  (
    <PrivateRoute>
      <SysAdminDashboard/>
    </PrivateRoute>
  ):roles.find((role)=> role  ==="ROLE_AUTHOR") ? (
    <PrivateRoute>
    <Dashboard/>
    </PrivateRoute>
  ): <></>
}/>
<Route path="/papers/:id/view" element={
  roles.find((role)=> role === "ROLE_REVIEWER") ? (
    <PrivateRoute>
      <PaperViewReviewer/>
    </PrivateRoute>
  ) : roles.find((role)=> role  === "ROLE_CONF_CHAIR") ? (
    <PrivateRoute>
      <PaperViewConfChair/>
    </PrivateRoute>
  ):roles.find((role)=> role  ==="ROLE_AUTHOR") ? (
    <PrivateRoute>
    <PaperView/>
    </PrivateRoute>
  ): <></>
}/>
      <Route path ="/papers/:id" element={
        <PrivateRoute>
          <PaperSubmit/>
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
