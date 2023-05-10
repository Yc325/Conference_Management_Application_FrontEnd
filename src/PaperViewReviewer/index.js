import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import ajax from '../Services/fetchService';
import {Button,Row,Col, Container,Card,ListGroup,Badge, NavDropdown,Tooltip,OverlayTrigger} from 'react-bootstrap'
import Rate from '../components/Rate';
import { useParams } from 'react-router-dom';
import Comment from '../components/Comment';
import NavBar from '../components/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'



const PaperViewReviewer = () => {
    const paperId = window.location.href.split("/")[4]

    //const {paperId} = useParams();

    const [jwt,setJwt] = useLocalState("","jwt")
    const [paper,setPaper] = useState(null)
    const [isLoading, setIsLoading] = useState(true); // Add a state variable for loading state
    const [file,setFile] = useState(null);

    const [rating,setRating] = useState(0)
    const [avgRating,setAvgRating] = useState(0)
    const [paperID, setPapersID] = useState(null)
    const [allScores, setAllScores] = useState([])
    const emptyComment = 
    {
      text: "",
      paperId: paperId !=null ? parseInt(paperId):null,
      user: jwt
    }

    const [comment,setComment] = useState(emptyComment)

    const [comments, setComments] = useState([])




    const renderTooltip = (props) => (
      <Tooltip
      id="button-tooltip" {...props}>
        <ul>
          <li><strong>7 stars</strong> (strong accept)</li>
          <li><strong>6 stars</strong> (accept)</li>
          <li><strong>5 stars</strong> (weak accept)</li>
          <li><strong>4 stars</strong> (borderline paper)</li>
          <li><strong>3 stars</strong> (weak reject)</li>
          <li><strong>2 stars</strong> (reject)</li>
          <li><strong>1 stars</strong> (strong reject)</li>
        </ul>
      </Tooltip>
    );

    const Example = () => (
      <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <FontAwesomeIcon
            style={{marginLeft:"1em"}}
            icon={faInfoCircle}
      />
    </OverlayTrigger>
    )

    function getScoreString(score) {
      switch (Math.round(score)) {
        case 1:
          return "strong reject";
        case 2:
          return "reject";
        case 3:
          return "weak reject";
        case 4:
          return "borderline paper";
        case 5:
          return "weak accept";
        case 6:
          return "accept";
        case 7:
          return "strong accept";
        default:
          return score.toString();
      }
    }

function submitComment(){
  ajax("/api/comments",'post',jwt,comment).then((data)=>
  {
  const commentsCopy = [...comments]
  commentsCopy.push(data)
  setComments(commentsCopy)
  setComment(emptyComment)
}
)}


function updateComment(value){
  const commentCopy = { ...comment }
  commentCopy.text = value
  setComment(commentCopy)
}

function handleDeleteComment(commentId){
  ajax(`/api/comments?commentId=${commentId}`,"delete", jwt).then(()=>{
    const commentsCopy = [...comments];
    const i = commentsCopy.findIndex((d)=> d.id === commentId);
    commentsCopy.splice(i,1);
    setComments(commentsCopy)

   })
  
}

useEffect(()=>{
ajax(`/api/score?paperId=${paperId}`,"get",jwt).then((scoreData) => {
  setAllScores(scoreData)
  console.log(scoreData)
})
},[]);


useEffect(()=>{
  ajax(`/api/comments?paperId=${paperId}`,"get",jwt).then((commentData)=>{
    setComments(commentData)
  })
},[]);

    useEffect(() => {
      ajax(`/api/papers/${paperId}`,"GET",jwt)
      .then((paperData) => {
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
  .then((rev_list) =>{
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
      ajax(`/api/score?paperId=${paperId}`,"get",jwt).then((scoreData) => {
              setAllScores(scoreData)
              console.log(scoreData)
            })

   })  
}

function Bid(){
  ajax(`/api/papers?paperId=${paperId}`,"put",jwt).then((data)=> {
    console.log("DONE")
    window.location.href= '/dashboard'
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

<Card style={{ width: '100%'}} key={paper.id}>
      <Card.Body>
      <Row>
        <Col className='d-flex flex justify-content-between'>
        <Card.Title>Paper {paperId}</Card.Title>
         {rating === 0?
         <>
        <NavDropdown
        title="..." 
        id="nav-dropdown"
        >
        <NavDropdown.Item onClick={() => Bid()}>bid</NavDropdown.Item>
        </NavDropdown>
         </>
         :
         <></>}

        </Col>
        </Row>

       
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
        {rating != 0?<>
        <Card.Text>
        Reviewers:
        <ListGroup>
        {allScores.map((scoreData) => (
        <ListGroup.Item action variant="secondary">
        <Row>
          <Col className='d-flex flex justify-content-between'>
          <span>{scoreData.reviwer.username}</span>
          <span>{getScoreString(scoreData.score)}</span>
          </Col>
        </Row>

        </ListGroup.Item>
  ))}
</ListGroup>
        </Card.Text>
        
        </>
        :
        <></>}
       
        <Card.Subtitle className="mb-2 text-muted justify-content-center">
          File Name: {paper.file.fileName}
          </Card.Subtitle>
          <Row>
            <Col className='d-flex flex justify-content-between'>
            <Button size="lg" onClick={() => downloadFile()}>Download</Button>
            <Button  variant="secondary" size='lg' onClick={()=>{
            window.location.href= '/dashboard'}}>
            Back
          </Button>
            </Col>
          </Row>
         {resultOfBoll ? 
         <>
         {/* RATING  */}
        <Row style={{marginTop:'1em'}}>
          <Col className='d-flex flex justify-content-center align-items-center'>
            {rating === 0? 
            <>
            <Rate rating={rating} 
            onRating={(rate) => setScore(rate)}/>
            <Example/>
            </>
            :
            <>
            <Rate 
            rating={rating}
            onRating={(rate) => setRating(rate)}
            pointerEvents={"none"}/>
            <Example/>
            </>}
          </Col>
        </Row> 
        </>
        : <>
        </>}
        <Row style={{marginTop:'1em'}}>
          <Col className='d-flex flex justify-content-center'>
          <p>Avarage Rating - {getScoreString(avgRating)}</p>
          </Col>
        </Row>

      </Card.Body>
    </Card>
</Container>
<Container>
    <h1>Comments</h1>
    {rating === 0? 
    <>
    </>
    :
    <>
        {resultOfBoll ? 
         <>
         {/* Comments  */}
        <div className='mt-4'>
          <textarea style={{width: "100%", borderRadius: "0.25em"}}
          onChange={(e) => updateComment(e.target.value)}
          value = {comment.text}
          />
          <Button onClick={()=> submitComment()}>
          Post Comment
          </Button>

        </div>
        </>
        : <>
        </>}
    </>}
        <div className='mt-5'>
      {comments.map((commentView) => (
        <Comment createdDate = {commentView.postedAt}
        createdBy = {commentView.reviewer.username}
        text = {commentView.comment}
        emitDeleteComment = {handleDeleteComment}
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

export default PaperViewReviewer;
