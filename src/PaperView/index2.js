import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import ajax from '../Services/fetchService';


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
<div style={{ 
    backgroundColor: "#F7F7F7", 
    backgroundImage: "url('https://www.example.com/background-pattern.jpg')",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"}}>
        {isLoading ? ( // Display loading state if data has not been loaded yet
          <h1>Loading...</h1>
        ) : (
          <>
          {console.log(paper)}
<div 
style={{
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ 
          fontSize: "36px",
          color: "#333"
        }}>
          Paper {paperId}
        </h1>
        <h2 style={{ 
          fontSize: "24px",
          color: "#666",
          marginBottom: "20px"
        }}>
          {paper.name} 
        </h2>
        <h3 style={{ 
          fontSize: "18px",
          color: "#999",
          marginBottom: "10px"
        }}>
          Author:
        </h3>
        <ul style={{ 
          listStyle: "none",
          margin: 0,
          padding: 0
        }}>

{paper.authors ? (
  <>
    {Array.from(new Set(paper.authors.map(author => author.username))).map((name) => (
      <li key={name} style={{ 
        fontSize: "16px",
        color: "#333",
        marginBottom: "5px"
      }}>
        {name}
      </li>
    ))}
  </>
) : (
  <li style={{ 
    fontSize: "16px",
    color: "#999"
  }}>
    Unknown
  </li>
)}
        </ul>
    <h2 
    style={{
      fontSize: "20px", marginBottom: "10px"
      }}>
        Status: {paper.status}</h2>
    <span style={{fontSize: "18px"}}>
    <h3 style={{
      fontSize: "18px",
      color: "#999"}}>
        File Name: 
        </h3>
        {paper.file.fileName} 
        <button style={{background: "#2ecc71", color: "#fff", borderRadius: "5px", padding: "5px 10px", marginLeft: "20px", border: "none", outline: "none", cursor: "pointer", boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)"}} onClick={() => downloadFile()}>
            Download
        </button>
    </span>
</div>
<div style={{marginTop: "30px"}}>
    <h1 style={{fontSize: "30px", marginBottom: "20px", textTransform: "uppercase"}}>Comments</h1>
    {paper.comments ? (
        paper.comments.map((comment, index) => (
            <div key={index} style={{background: "#f1f1f1", padding: "10px", marginBottom: "10px", borderRadius: "5px", boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)"}}>
                <h2 style={{fontSize: "20px", marginBottom: "10px"}}>Comment {index + 1}</h2>
                <p style={{fontSize: "16px", lineHeight: "1.5"}}>{comment}</p>
            </div>
        ))
    ) : (
        <div style={{background: "#f1f1f1", padding: "10px", marginBottom: "10px", borderRadius: "5px", boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)"}}>
            <h2 style={{fontSize: "20px", marginBottom: "10px"}}>No comments</h2>
            <p style={{fontSize: "16px", lineHeight: "1.5"}}>Be the first to comment!</p>
        </div>
    )}
</div>



          </>
        )}
      </div>
    );
  }

export default PaperView;

