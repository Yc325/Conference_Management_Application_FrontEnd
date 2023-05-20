import React, { useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import {Container, Row, Col,Button, Form} from 'react-bootstrap'
import NavBar from '../components/NavBar';

const Login = () => {

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const [jwt,setJwt] = useLocalState("","jwt")

function sendLoginRequest(){
    const reqBody = {
    "username":username,
    "password":password
  };
  fetch('api/auth/login',{
    headers:{
      "Content-Type":"application/json"
    },

    method: "post",

    body: JSON.stringify(reqBody),

  })
  .then(response => {
    if (response.status === 200)
        return Promise.all([response.json(),response.headers])
    else
        return Promise.reject("Invalid Login Attampt")

})
  .then(([body,headers]) =>{
    setJwt(headers.get('authorization'));
    localStorage.setItem("status",true)
    window.location.href = "dashboard";
    
 }).catch((message)=> {
    alert(message)
 } );
};
return (
        <>
        <NavBar jwt=""/>
        <Container className='mt-5'>
          <Row className='justify-content-center align-items-center'>
            <Col md="8" lg="6">
            <Form.Group 
            className="mb-3 " 
            controlId="username">
            <Form.Label className='fs-4'>
              Username
            </Form.Label>
            <Form.Control
            type="email"
            size='lg'
            placeholder='Enter email'
            value={username}
            onChange={(event)=> setUsername(event.target.value)}/>
</Form.Group>
            </Col>
          </Row>

          <Row className='justify-content-center align-items-center'>
          <Col md="8"lg="6">
            <Form.Group 
            className="mb-3"
            controlId="password">
            <Form.Label className='fs-4'>Passoword</Form.Label>
            <Form.Control
            type="password"
            size='lg'
            placeholder='Enter password'
            value={password}
            onChange={(event)=> setPassword(event.target.value)}/>
</Form.Group>
</Col>
</Row>
<Row className='justify-content-center align-items-center'>
  <Col md="8" lg="6" className='mt-2 d-flex flex-column gap-4 flex-md-row justify-content-md-between'>
            <Button
            id="submit"
            type='button'
            size='lg'
            onClick={() => sendLoginRequest()}>
            Login
            </Button>

            <Button
            variant="secondary"
            size='lg'onClick={()=>{
            window.location.href= '/'}}>
            Exit
            </Button>
  </Col>
</Row>

        </Container>
        </>
    );
};

export default Login;