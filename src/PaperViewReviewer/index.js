import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import ajax from '../Services/fetchService';
import {Button,Row,Col, Container,Card,ListGroup,Badge} from 'react-bootstrap'
import Rate from '../components/Rate';




const PaperViewReviewer = () => {
    const paperId = window.location.href.split("/")[4]

    const [jwt,setJwt] = useLocalState("","jwt")
    const [paper,setPaper] = useState(null)
    const [isLoading, setIsLoading] = useState(true); // Add a state variable for loading state
    const [file,setFile] = useState(null);

    const [rating,setRating] = useState(0)
    const [avgRating,setAvgRating] = useState(0)
    const [paperID, setPapersID] = useState(null)
    

    useEffect(() => {
      ajax(`/api/papers/${paperId}`,"GET",jwt)
      .then((paperData) => {
        console.log(paperData)
        setPaper(paperData);
        setFile(paperData.file);
        setIsLoading(false); // Set loading state to false when data has been fetched
      });
  }, []);

  useEffect(()=> {
    ajax("/api/papers/reviewer","GET",jwt)
    .then(paperData => {
    setPapersID(paperData.map(paper => paper.id));
          })
  },[])

  useEffect(()=> {
    fetch(`/api/score/${paperId}`,{
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${jwt}`,
        },
        method:"GET",
    }).then(response => {
         if (response.status === 200) return response.json()
        }).then(rating => {
          setRating(rating);
        })
},[])

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
        console.log(rating)
        setAvgRating(rating);
      })
},[])



  const resultOfBoll = paperID && paperID.includes(paper.id);

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


function setScore(rate){
  setRating(rate)
  ajax(`/api/score/${rate}/${paperId}`,"post",jwt)
  .then(rev_list =>{
    console.log(rev_list)
    window.location.reload(false);
   })  
}


    return (
<div>
{isLoading ? ( // Display loading state if data has not been loaded yet
<h1>Loading...</h1>
) : (
<>
<Container className='mt-5'>
<Card style={{ width: '100%'}} key={paper.id}>
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
          <Row>
            <Col className='d-flex flex justify-content-between'>
            <Button size="lg" onClick={() => downloadFile()}>Download</Button>
            <Button  variant="secondary" size='lg'onClick={()=>{
            window.location.href= '/dashboard'}}>
            Back
          </Button>
            </Col>
          </Row>
         {resultOfBoll ? 
         <>
         {/* RATING  */}
        <Row style={{marginTop:'1em'}}>
          <Col className='d-flex flex justify-content-center'>
            {rating === 0? 
            <>
            <Rate rating={rating} 
            onRating={(rate) => setScore(rate)}/>
            </>
            :
            <>
            <Rate 
            rating={rating}
            onRating={(rate) => setRating(rate)}
            pointerEvents={"none"}/>
            </>}
          </Col>
        </Row> 
        <Row style={{marginTop:'1em'}}>
          <Col className='d-flex flex justify-content-center'>
          <p>Avarage Rating - {avgRating}</p>
          </Col>
        </Row>
        </>
        : <>
        </>}

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

export default PaperViewReviewer;
