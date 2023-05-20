import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import jwt_decode from "jwt-decode";
import ajax from '../../Services/fetchService';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { faMessage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DropDownComponent from './index1';
import logo from '../../img/Logo.svg'
import { useLocalState } from '../../util/useLocalStorage';




const NavBar = (props) => {


    const status = localStorage.getItem("status")
    console.log(status)
    const [jwtCache,setJwtCache] = useLocalState("","jwt")
    const {jwt} = props


    const [notification,setNotification] = useState([])

    const decode_jwt = jwt_decode(jwtCache)
  
    function handleReadNotification(notificationId){
        ajax(`/api/notification?notificationId=${notificationId}`,"put",jwtCache).then(()=>{
            const notificationCopy = [...notification];
            const i = notificationCopy.findIndex((d)=> d.id === notificationId);
            notificationCopy.splice(i,1);
            setNotification(notificationCopy)
        })

    }
      useEffect(()=>{
        if (status!=="false"){
        ajax(`/api/notification`,"get",jwtCache).then((notificationData)=>{
          setNotification(notificationData)
        })
      }
      },[]);
      function Logout(){
        localStorage.setItem("status",false)
        window.location.href = "/login"
      }
    return (
        <>
        <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/">
        <img style={{width:"200px"}} src={logo}/>
            </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
            </Nav>
            {status!=="false" ? <> <Nav.Link href="/dashboard" style={{fontWeight:"700",fontSize:"20px"}}>Dashboard</Nav.Link></> : <></>}


      {status!=="false"? 
        <>
         <Dropdown
        className="d-inline mx-2"
        autoClose="outside"
        drop="start">
        <Dropdown.Toggle 
        id="dropdown-autoclose-outside">

      <FontAwesomeIcon 
        size="lg"
        icon={faMessage}
        pull="right"
        className="highlight"/>
        {notification.length}

        </Dropdown.Toggle>

        <Dropdown.Menu>
        {notification.map((data)=>(
            <DropDownComponent
            id = {data.id}
            type = {data.type}
            msg = {data.msg}
            sender = {data.sender.username}
            paper = {data.paper.id}
            emitReadNotification = {handleReadNotification}
            date = {data.date}
            />
        ))}
        </Dropdown.Menu>
      </Dropdown>
        </>
         : 
        <>
        </>}
            {status=="false"?
            <>
            <Nav.Link style={{fontWeight:"700"}} href="/login">Login</Nav.Link>
            </>
            :
            <>
            <Nav.Link href="#" style={{fontWeight:"700"}}>{decode_jwt.sub}</Nav.Link>
            <Nav.Link style={{marginLeft:"5px",color:"black",fontWeight:"700"}} onClick={()=>Logout()} >Logout</Nav.Link>
            </>}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      </>
    );
};

export default NavBar;
