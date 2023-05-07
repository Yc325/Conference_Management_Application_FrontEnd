import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import ajax from '../Services/fetchService';
import {Button,Row,Col, Container,Card,ListGroup,Badge} from 'react-bootstrap'
import Comment from '../components/Comment';
import NavBar from '../components/NavBar';


const PaperViewConfChair = () => {
    const paperId = window.location.href.split("/")[4]

    const [jwt,setJwt] = useLocalState("","jwt")
    const [paper,setPaper] = useState(null)
    const [isLoading, setIsLoading] = useState(true); // Add a state variable for loading state
    const [file,setFile] = useState(null);
    const [comments, setComments] = useState([])
    const [avgRating,setAvgRating] = useState(0)

useEffect(()=> {
  fetch(`/api/score/avg/${paperId}`,{
      headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${jwt}`,
      },
      method:"GET",
  }).then(response => {
       if (response.status === 200) return response.json()
      }).then(rating => {
        setAvgRating(rating);
      })
},[])


    useEffect(() => {
      ajax(`/api/papers/${paperId}`,"GET",jwt)
      .then((paperData) => {
        setPaper(paperData);
        setFile(paperData.file);
        setIsLoading(false); // Set loading state to false when data has been fetched
      });
  }, []);

  useEffect(()=>{
    ajax(`/api/comments?paperId=${paperId}`,"get",jwt).then((commentData)=>{
      setComments(commentData)
    })
  },[]);


    function downloadFile() {
        fetch(`/api/papers/dowloadFile/${file.id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`
          },
          method: "GET"
        })
          .then((response) => {
            const filename =  response.headers.get('Content-Disposition').split('filename=')[1];
        response.blob().then(blob => {
          let url=  window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
        });
    });
}

function makeDecision(decision){
  ajax(`/api/papers/${paperId}?decision=${decision}`,"put",jwt).then(()=>{
    window.location.reload(false);
  })
}

    return (
<div>
<NavBar jwt = {jwt}/>
{isLoading ? ( // Display loading state if data has not been loaded yet
<h1>Loading...</h1>
) : (
<>
<Container className='mt-5'>
<Card style={{ width: '100%'}}>
      <Card.Body>
        <Card.Title>Paper {paperId}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{paper.name}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">
          Paper Status
          <Badge 
          style={{marginLeft:"1em"}}
          pill
          bg={paper.status === "Submitted" ? "success" : paper.status === "Needs to be submitted" ? "danger" : "gray" }>
          {paper.status}
          </Badge>
          </Card.Subtitle>
          <Card.Subtitle className='mb-2 text-muted'>
            Conference Chair Decesion
          <Badge 
          style={{marginLeft:"1em"}}
          pill
          bg={paper.conferenceManagementDecision === true ? "success" : paper.conferenceManagementDecision === false ? "danger" : paper.conferenceManagementDecision === null ? "secondary" : "warning" }
          >
          {paper.conferenceManagementDecision === true ? "Accepted" : paper.conferenceManagementDecision === false ? "Rejected" : paper.conferenceManagementDecision === null ? "Pending" : "Undefined"}
          </Badge>
          </Card.Subtitle>
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
        <Card.Subtitle className="mb-2 text-muted justify-content-center">
          File Name: {paper.file.fileName}
          </Card.Subtitle>
          <Row>
            <Col className='d-flex flex justify-content-center gap-5'>
            <Button size="lg" onClick={() => downloadFile()}>Download</Button>
            {paper.conferenceManagementDecision === null ?
            <>
            <Button variant="danger" size="lg" onClick={() => makeDecision(false)}>Reject</Button>
            <Button variant="success" size="lg" onClick={() => makeDecision(true)}>Accept</Button>
            </> : <></>}

            </Col>
          </Row>
          <Row style={{marginTop:'1em'}}>
          <Col className='d-flex flex justify-content-center'>
          <p>Avarage Rating - {avgRating}</p>
          </Col>
        </Row>
          <Row style={{marginTop:"1em"}}>
            <Col className='d-flex flex justify-content-end'>
            <Button  variant="secondary" size='lg'onClick={()=>{
            window.location.href= '/dashboard'}}>
            Back
          </Button>
            </Col>
          </Row>

      </Card.Body>
    </Card>
</Container>
<Container>
    <h1>Comments</h1>
    <div className='mt-5'>
      {comments.map((commentView) => (
        <Comment createdDate = {commentView.postedAt}
        createdBy = {commentView.reviewer.username}
        text = {commentView.comment}
        emitDeleteComment = {null}
        id = {commentView.id}
        jwt = {jwt}
        />
      ))}

    </div>
</Container>
          </>

        )}
        
      </div>
    );
  }

export default PaperViewConfChair;