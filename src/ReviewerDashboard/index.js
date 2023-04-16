import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import ajax from '../Services/fetchService';
import {Button,Card,Badge,Row,Col} from 'react-bootstrap'

const ReviwerDashboard = () => {

    const [jwt,setJwt] = useLocalState("","jwt")

    const [papers,setPapers] = useState(null)


    useEffect(()=> {
      ajax("/api/papers/reviewer","GET",jwt)
      .then(paperData => {
      setPapers(paperData);
            })
    },[])

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

        <Card.Subtitle className="mb-2 text-muted">
          Paper Score: {paper.score}
          </Card.Subtitle>

        <Card.Subtitle className="mb-2 text-muted">
          Paper Name: {paper.name}
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

  );
};

export default ReviwerDashboard;