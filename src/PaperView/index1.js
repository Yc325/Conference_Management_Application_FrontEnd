import React, { useEffect, useState } from 'react';
import ajax from '../Services/fetchService';
import {Button,Form, ListGroup,Card, Container} from 'react-bootstrap'
import { useLocalState } from '../util/useLocalStorage';

const PaperEdit = () => {
    const paperId = window.location.href.split("/")[4]

    const [jwt,setJwt] = useLocalState("","jwt")

    const [paper,setPaper] = useState(null)
    const [isLoading, setIsLoading] = useState(true); // Add a state variable for loading state
    const [username, setUsername] = useState("")


    function sendSetUserReq(){
      ajax(`/api/papers/${paperId}/addauthor/${username}`
      ,"POST"
      ,jwt
      ,{paperId,username}
      ).then((body)=>{
        if(body) setPaper(body)
        else alert("can not find a user")
      })
    }

    useEffect(() => {
      ajax(`/api/papers/${paperId}`,"GET",jwt)
      .then((body) => {
      setPaper(body);
      setIsLoading(false); // Set loading state to false when data has been fetched
      });
      }, []);

    return (
<div>
  {isLoading ? ( 
    <h1>Loading...</h1>
  ) : (
    <>
      <Container className='mt-5 '>
      <Card style={{ width: '100%' }}>
      <Card.Body>
        <Card.Title>Paper {paperId}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{paper.name}</Card.Subtitle>
        <Card.Text>
         Authors:
         <ListGroup>
        {paper.authors ? (
          <>
        {Array.from(new Set(paper.authors.map(author => author.username))).map((name) => (
        <ListGroup.Item action variant="secondary">{name}</ListGroup.Item>
        ))}
        </>
        ) : (
        <ListGroup.Item action variant="danger">Unknown</ListGroup.Item>
        )}
      </ListGroup>
        </Card.Text>
        <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Add Author</Form.Label>
        <Form.Control 
            type="email" 
            id="author" 
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}/>
        </Form.Group>
        </Form>
        <Button
            id="submit" 
            type='button' 
            onClick={() => sendSetUserReq()}>
            Add Author
          </Button>
      </Card.Body>
    </Card>
      </Container>
    </>
  )}
</div>
    );
};

export default PaperEdit;

