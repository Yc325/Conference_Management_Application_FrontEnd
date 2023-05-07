import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import ajax from '../Services/fetchService';
import {Button,Card,Badge,Row,Col} from 'react-bootstrap'
import NavBar from '../components/NavBar';

const Dashboard = () => {

    const [jwt,setJwt] = useLocalState("","jwt")

    const [papers,setPapers] = useState(null)

    const[paperName,setPaperName] = useState(null)
    const[author,setAuthor] = useState(null)

    useEffect(()=> {
      ajax("/api/papers","GET",jwt)
      .then(paperData => {
      setPapers(paperData);
            })
    },[])

    function createPaper(){
      ajax("/api/papers","POST",jwt)
      .then(paper => {
        window.location.href = `/papers/${paper.id}`;
      })
    }

    return (
<>
<NavBar jwt = {jwt}/>

<div style={{margin: "2em"}}>

<Row>
<Col>
<Button size="lg" variant="success" style={{margin:"1em"}} onClick={() => createPaper()}>
Create new Paper 
</Button>
  </Col>
</Row>


{papers ? (
  <div 
  className='d-grid gap-5'
  style={{gridTemplateColumns:"repeat(auto-fill,18rem)"}}>
{papers.sort((a, b) => a.id - b.id)
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
          Paper Score: {paper.score}
          </Card.Subtitle>

        <Card.Subtitle className="mb-2 text-muted">
        Paper Name: {paper.name.slice(0, 20) + (paper.name.length > 20 ? "..." : "")}
          </Card.Subtitle>

      {paper.status === "Needs to be submitted" ? 
      <Card.Link href={`/papers/${paper.id}`}>
      <Button variant="dark">Submit Paper</Button>
      </Card.Link> 
      :<>
      <Card.Link href={`/papers/${paper.id}/view`}>
      <Button>View Paper</Button>
      </Card.Link>
      <Card.Link href={`/papers/${paper.id}/edit`}>
      <Button variant="secondary">Add Author</Button>
      </Card.Link>
      </>}
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

export default Dashboard;