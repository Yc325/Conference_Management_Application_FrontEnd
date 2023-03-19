import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocalState } from '../util/useLocalStorage';

const Dashboard = () => {

    const [jwt,setJwt] = useLocalState("","jwt")

    const [papers,setPapers] = useState(null)

    const[paperName,setPaperName] = useState(null)
    const[author,setAuthor] = useState(null)

    useEffect(()=> {
        fetch("/api/papers",{
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${jwt}`,
            },
            method:"GET",
        }).then(response => {
             if (response.status === 200) return response.json()
            }).then(paperData => {
                setPapers(paperData);
            })
    },[])

    function createPaper(){
        fetch("/api/papers", {
            headers:{
                "Content-Type":"application/json",
                Authorization :`Bearer ${jwt}`,

            },
            method:"POST",

        }).then(response=>{
            if (response.status === 200) return response.json()

        }).then(paper => {
            window.location.href = `/papers/${paper.id}`;
        })
    }
    return (
<div>
<div style={{
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "20px",}}>

{papers ? (
  papers.sort((a, b) => a.id - b.id)
  .map((paper) =>(
    <div style={{ 
      backgroundColor: "#F7F7F7", 
      backgroundImage: "url('https://www.example.com/background-pattern.jpg')",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      width: "calc(30% - 10px)",
      marginBottom: "20px"
    }}>
      <div style={{ 
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ 
          fontSize: "36px",
          color: "#333",
          marginBottom: "10px"
        }}>
          Paper {paper.id}
        </h1>
        <h3 style={{ 
          fontSize: "18px",
          marginBottom: "5px",
          color: "#666"
        }}>
          Paper Status: {paper.status}
        </h3>
        <h3 style={{ 
          fontSize: "18px",
          marginBottom: "5px",
          color: "#666"
        }}>
          Paper Score: {paper.score}
        </h3>
        <h3 style={{ 
          fontSize: "18px",
          marginBottom: "5px",
          color: "#666"
        }}>
          Paper Name: {paper.name}
        </h3>
        {paper.status === "Needs to be submitted" ? 
          <Link to={`/papers/${paper.id}`} style={{ 
            display: "inline-block",
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "5px",
            textDecoration: "none",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            fontSize: "16px",
            marginTop: "10px",
            marginRight: "10px",
            cursor: "pointer"
          }}>
  Submit Paper
</Link> 
:
<>
<Link to={`/papers/${paper.id}/view`} style={{ 
  display: "inline-block",
  backgroundColor: "#008CBA",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "5px",
  textDecoration: "none",
  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
  fontSize: "16px",
  marginTop: "10px",
  marginRight: "10px",
  cursor: "pointer"
}}>
  View Paper
</Link>
<Link to={`/papers/${paper.id}/edit`} style={{ 
  display: "inline-block",
  backgroundColor: "#f44336",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "5px",
  textDecoration: "none",
  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
  fontSize: "16px",
  marginTop: "10px",
  marginRight: "10px",
  cursor: "pointer"
}}>
  Add Author
</Link>
</>}
    

</div>
</div>
))): (<></>)}
</div>
<button style={{ 
  backgroundColor: "#4CAF50",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
}} onClick={() => createPaper()}>
  Create new Paper
</button>
        </div>
    );
};

export default Dashboard;