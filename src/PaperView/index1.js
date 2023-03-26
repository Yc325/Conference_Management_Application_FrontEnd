import React, { useEffect, useState } from 'react';
import ajax from '../Services/fetchService';

import { useLocalState } from '../util/useLocalStorage';

const PaperEdit = () => {
    const paperId = window.location.href.split("/")[4]

    const [jwt,setJwt] = useLocalState("","jwt")

    const [paper,setPaper] = useState(null)
    const [isLoading, setIsLoading] = useState(true); // Add a state variable for loading state
    const [username, setUsername] = useState("")


    function sendSetUserReq(){
      ajax(`/api/papers/${paperId}/addauthor/${username}`
      ,"POST"
      ,jwt
      ,{paperId,username}
      ).then((body)=>{
        if(body) setPaper(body)
        else alert("can not find a user")
      })
    }

    useEffect(() => {
      ajax(`/api/papers/${paperId}`,"GET",jwt)
      .then((body) => {
      setPaper(body);
      setIsLoading(false); // Set loading state to false when data has been fetched
      });
      }, []);

    return (
<div style={{ 
  backgroundColor: "#F7F7F7",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
}}>
  {isLoading ? ( 
    <h1>Loading...</h1>
  ) : (
    <>
      <div style={{ 
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
        <div style={{ 
          marginTop: "30px"
        }}>

          <label htmlFor="author" style={{ 
            fontSize: "16px",
            color: "#333",
            marginRight: "10px"
          }}>
            Add Author:
          </label>

          <input
            type="email" 
            id="author" 
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            style={{ 
              fontSize: "16px",
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginRight: "10px"
            }}/>

          <button 
            id="submit" 
            type='button' 
            onClick={() => sendSetUserReq()}
            style={{ 
              fontSize: "16px",
              padding: "10px 20px",
              borderRadius: "5px",
              backgroundColor: "#333",
              color: "white",
              border: "none"
            }}>
            Add Author
          </button>

        </div>
      </div>
    </>
  )}
</div>
    );
};

export default PaperEdit;

