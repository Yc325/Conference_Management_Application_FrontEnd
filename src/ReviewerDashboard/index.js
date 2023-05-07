import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import ajax from '../Services/fetchService';
import {Button,Card,Badge,Row,Col} from 'react-bootstrap'
import NavBar from '../components/NavBar';


const ReviwerDashboard = () => {

    const [jwt,setJwt] = useLocalState("","jwt")

    const [Revpapers,setRevPapers] = useState(null)

    const [papers,setPapers] = useState(null)

    const [paperID, setPapersID] = useState(null)

    const [paperScore,setPaperScore] = useState(null)

    useEffect(()=> {
      ajax("/api/papers/reviewer","GET",jwt)
      .then(paperData => {
        console.log(paperData)
        setRevPapers(paperData);
      setPapersID(paperData.map(paper => paper.id));
            })
    },[])

    useEffect(()=> {
      ajax("/api/papers/all","GET",jwt)
      .then(paperData => {
        setPapers(paperData);
            })
    },[])

    return (

<>
<NavBar jwt = {jwt}/>

<div style={{margin: "2em"}}>


<h1>Rate Papers</h1>
{Revpapers ? (
  <div 
  className='d-grid gap-5'
  style={{gridTemplateColumns:"repeat(auto-fill,18rem)"}}>
{Revpapers.sort((a, b) => a.id - b.id)
  .map((paper) =>(
    
    
      <Card key={paper.id} style={{ width: '20rem' }}>
      <Card.Body>
        <Card.Title>Paper {paper.id}</Card.Title>

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
          Conference Chair Decision
          <Badge 
          style={{marginLeft:"1em"}}
          pill
          bg={paper.conferenceManagementDecision === true ? "success" : paper.conferenceManagementDecision === false ? "danger" : paper.conferenceManagementDecision === null ? "secondary" : "warning" }
          >
          {paper.conferenceManagementDecision === true ? "Accepted" : paper.conferenceManagementDecision === false ? "Rejected" : paper.conferenceManagementDecision === null ? "Pending" : "Undefined"}
          </Badge>
          </Card.Subtitle>

          <Card.Subtitle className="mb-2 text-muted">
        Paper Name: {paper.name.slice(0, 20) + (paper.name.length > 20 ? "..." : "")}
          </Card.Subtitle>

      <Card.Link href={`/papers/${paper.id}/view`}>
      <Button>Rate Paper</Button>
      </Card.Link>
      </Card.Body>
    </Card>

)
)}
</div>
)
: (<></>)}


<h1>Other Papers</h1>
{papers ? (
  <div 
  className='d-grid gap-5'
  style={{gridTemplateColumns:"repeat(auto-fill,18rem)"}}>
{papers.filter(paper => !paperID.includes(paper.id))
  .sort((a, b) => a.id - b.id)
  .map((paper) =>(
    
    
      <Card key={paper.id} style={{ width: '20rem' }}>
      <Card.Body>
        <Card.Title>Paper {paper.id}</Card.Title>

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
          Conference Chair Decision
          <Badge 
          style={{marginLeft:"1em"}}
          pill
          bg={paper.conferenceManagementDecision === true ? "success" : paper.conferenceManagementDecision === false ? "danger" : paper.conferenceManagementDecision === null ? "secondary" : "warning" }
          >
          {paper.conferenceManagementDecision === true ? "Accepted" : paper.conferenceManagementDecision === false ? "Rejected" : paper.conferenceManagementDecision === null ? "Pending" : "Undefined"}
          </Badge>
          </Card.Subtitle>

        {/* <Card.Subtitle className="mb-2 text-muted">
          Paper Score: {paper.score}
          </Card.Subtitle> */}

          <Card.Subtitle className="mb-2 text-muted">
        Paper Name: {paper.name.slice(0, 20) + (paper.name.length > 20 ? "..." : "")}
          </Card.Subtitle>


      <Card.Link href={`/papers/${paper.id}/view`}>
      <Button>View Paper</Button>
      </Card.Link>
      </Card.Body>
    </Card>

)
)}
</div>
)
: (<></>)}
</div>
</>

  );
};

export default ReviwerDashboard;