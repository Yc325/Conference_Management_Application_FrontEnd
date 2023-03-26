import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import ajax from '../Services/fetchService';
import {Button,Form, Container,Card,ListGroup,Badge} from 'react-bootstrap'


const PaperView = () => {
    const paperId = window.location.href.split("/")[4]

    const [jwt,setJwt] = useLocalState("","jwt")
    const [paper,setPaper] = useState(null)
    const [isLoading, setIsLoading] = useState(true); // Add a state variable for loading state
    const [file,setFile] = useState(null);

    useEffect(() => {
      ajax(`/api/papers/${paperId}`,"GET",jwt)
      .then((paperData) => {
        setPaper(paperData);
        setFile(paperData.file);
        setIsLoading(false); // Set loading state to false when data has been fetched
      });
  }, []);


    function downloadFile() {
        fetch(`/api/papers/dowloadFile/${file.id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`
          },
          method: "GET"
        })
          .then((response) => {
            console.log(response)
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
    return (
<div>
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
          <Button onClick={() => downloadFile()}>Download</Button>
      </Card.Body>
    </Card>
</Container>
<Container>
    <h1>Comments</h1>
    {paper.comments ? (
        paper.comments.map((comment, index) => (
            <div key={index}>
                <h2>Comment {index + 1}</h2>
                <p>{comment}</p>
            </div>
        ))
    ) : (
        <div>
            <h2>No comments</h2>
            <p>Be the first to comment!</p>
        </div>
    )}
</Container>
          </>

        )}
        
      </div>
    );
  }

export default PaperView;

