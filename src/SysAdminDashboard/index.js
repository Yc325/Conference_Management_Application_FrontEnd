import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import ajax from '../Services/fetchService';
import {Button,Form,Row,Col,Container} from 'react-bootstrap'


const SysAdminDashboard = () => {

    const [jwt,setJwt] = useLocalState("","jwt")
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [role,setRole] = useState("")


function createUser(){
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const reqBody={
    "username":username,
    "password":password
  };
  console.log(JSON.stringify(reqBody))
  console.log(role)

fetch(`/api/user/${role}`,{
  headers:{
    "Content-Type":"application/json",
    Authorization: `Bearer ${jwt}`
  },
  method:"post",
  body: JSON.stringify(reqBody),
})
.then(response=>{
  if(response.status===200){
  console.log(response.json)
  return response.json;
  }
  else
  return alert("Error")
})
}
    return (

<div style={{margin: "2em"}}>
<Row>
<Col>
<Button size='lg'onClick={()=>{
  setJwt(null) 
  window.location.href= '/login'}}>
Logout
</Button>
  </Col>
</Row>


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
          <Col md="8"lg="6">
          <Form.Label >Role</Form.Label>
          <Form.Select 
          size="lg"
          value={role}
          onChange={(event)=> setRole(event.target.value)}>
            <option>Open this select menu</option>
            <option value="ROLE_AUTHOR">Author</option>
            <option value="ROLE_REVIEWER">Reviwer</option>
            <option value="ROLE_CONF_CHAIR">Conf Chair</option>
          </Form.Select>
</Col>
</Row>
<Row className='justify-content-center align-items-center'>
  <Col md="8" lg="6" className='mt-2 d-flex flex-column gap-4 flex-md-row justify-content-md-between'>
            <Button
            variant="success"
            id="submit"
            type='button'
            size='lg'
            onClick={() => createUser()}>
            Create User
            </Button>
  </Col>
</Row>

        </Container>

</div>

  );
};

export default SysAdminDashboard;