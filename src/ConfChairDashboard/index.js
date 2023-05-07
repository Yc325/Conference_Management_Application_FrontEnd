import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import ajax from '../Services/fetchService';
import {Button,Card,Container,Row,Col,ListGroup} from 'react-bootstrap'
import NavBar from '../components/NavBar';

const ConfChairDashboard = () => {

    const [jwt,setJwt] = useLocalState("","jwt")

    const [papers,setPapers] = useState(null)

    const[paperName,setPaperName] = useState(null)
    const[author,setAuthor] = useState(null)

    const [reviwers,setReviwers] = useState(null)

    useEffect(()=> {
      ajax("/api/papers/all","GET",jwt)
      .then(paperData => {
      setPapers(paperData);
            })
    },[])

    function getList(){
   ajax("/api/papers/reviwers","get",jwt)
   .then(rev_list =>{
    setReviwers(rev_list)
    console.log(rev_list)
   })
    }

    return (
<>
<NavBar jwt = {jwt}/>

<div style={{margin: "2em"}}>
<Row>
<Col className='d-flex flex justify-content-evenly'>

<Button size='lg'
  onClick={() => getList()}>
  Auto Assign 
</Button>

  </Col>
</Row>



{papers ? (
  <div className='d-flex flex-column gap-5'>
    {/* Accepted Papers */}
    {papers.filter((paper) => paper.conferenceManagementDecision === true && paper.status !== 'Needs to be submitted').length > 0 && (
      <div style={{ marginTop: '2rem',border:"1px dashed lightgrey" }}>
        <h1>Accepted Papers</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 18rem)', gap: '1rem' }}>
          {papers
            .filter((paper) => paper.conferenceManagementDecision === true && paper.status !== 'Needs to be submitted')
            .map((paper) => (
              <div key={paper.id}>
                <Card style={{ width: '100%', alignItems: 'center' }}>
                  <Card.Body>
                    <Card.Title>Paper {paper.id}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{paper.name}</Card.Subtitle>
                    <Card.Link href={`/papers/${paper.id}/view`}>
                      <Button>View Paper</Button>
                    </Card.Link>
                  </Card.Body>
                </Card>
              </div>
            ))}
        </div>
      </div>
    )}

    {/* Rejected Papers */}
    {papers.filter((paper) => paper.conferenceManagementDecision === false && paper.status !== 'Needs to be submitted').length > 0 && (
      <div style={{ marginTop: '2rem',border:"1px dashed lightgrey"}}>
        <h1>Rejected Papers</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 18rem)', gap: '1rem' }}>
          {papers
            .filter((paper) => paper.conferenceManagementDecision === false && paper.status !== 'Needs to be submitted')
            .map((paper) => (
              <div key={paper.id}>
                <Card style={{ width: '100%', alignItems: 'center' }}>
                  <Card.Body>
                    <Card.Title>Paper {paper.id}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{paper.name}</Card.Subtitle>
                    <Card.Link href={`/papers/${paper.id}/view`}>
                      <Button>View Paper</Button>
                    </Card.Link>
                  </Card.Body>
                </Card>
              </div>
            ))}
        </div>
      </div>
    )}

    {/* Pending Papers */}
    {papers.filter((paper) => paper.conferenceManagementDecision === null && paper.status !== 'Needs to be submitted').length > 0 && (
      <div style={{ marginTop: '2rem',border:"1px dashed lightgrey"}}>
        <h1>Pending Papers</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 18rem)', gap: '1rem' }}>
          {papers
            .filter((paper) => paper.conferenceManagementDecision === null && paper.status !== 'Needs to be submitted')
            .map((paper) => (
              <div key={paper.id}>
                <Card style={{ width: '100%', alignItems: 'center' }}>
                  <Card.Body>
                    <Card.Title>Paper {paper.id}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{paper.name}</Card.Subtitle>
                    <Card.Link href={`/papers/${paper.id}/view`}>
                      <Button>View Paper</Button>
                    </Card.Link>
                  </Card.Body>
                </Card>
              </div>
            ))}
        </div>
      </div>
    )}
  </div>
) : (
  <></>
)}

</div>
</>
    )}

export default ConfChairDashboard;