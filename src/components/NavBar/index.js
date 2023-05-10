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



const NavBar = (props) => {
    const {jwt} = props
    const [notification,setNotification] = useState([])
    const decode_jwt = jwt_decode(jwt)
    //console.log(decode_jwt)

    function handleReadNotification(notificationId){
        ajax(`/api/notification?notificationId=${notificationId}`,"put",jwt).then(()=>{
            const notificationCopy = [...notification];
            const i = notificationCopy.findIndex((d)=> d.id === notificationId);
            notificationCopy.splice(i,1);
            setNotification(notificationCopy)
        })

    }


    useEffect(()=>{
        ajax(`/api/notification`,"get",jwt).then((notificationData)=>{
          setNotification(notificationData)
        })
      },[]);
    return (
        <>

        <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
            </Nav>


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
    className="highlight"
  />
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

            <Nav.Link href="#action2">{decode_jwt.sub}</Nav.Link>
            <Nav.Link style={{margin:"15px",color:"black"}} href="/login">Logout</Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      </>
    );
};

export default NavBar;