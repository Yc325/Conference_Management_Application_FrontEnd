import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';

const PaperSubmit = () => {
    const paperId = window.location.href.split("/papers/")[1]

    const [jwt,setJwt] = useLocalState("","jwt")
    const [paper,setPaper] = useState(null)
    const [file,setFile] = useState(null)

function onFileChangeHandler(){
        const formData = new FormData();
        formData.append('file', file);
        console.log(file)
        fetch(`/api/papers/${paperId}`, {
            headers:{
                Authorization:`Bearer ${jwt}`,
            },
            method: 'post',
            body: formData
            
        }).then(res => {
            if(res.ok) {
                alert("File uploaded successfully.")
                window.location.href = "dashboard";
            }
        });
    };

        useEffect(()=> {
            fetch(`/api/papers/${paperId}`,{
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${jwt}`,
                },
                method:"GET",
            }).then(response => {
                 if (response.status === 200) return response.json()
                }).then(paperData => {
                    setPaper(paperData);
                })
        },[])

    return (
        <div>
            <h1>Paper {paperId}</h1>
            {paper ? (
            <>
            <div>
            <label htmlFor='file'>Your File</label>
            <input
            type="file"
            id="uploadPaper"
            accept=".pdf"
            onChange={(event)=> setFile(event.target.files[0])}/>
            </div>
            <div>
            <button id="submit" type='button'onClick={() => onFileChangeHandler()}>
            Submit File
            </button>

            </div>

            </>) : (<></>)}

        </div>
    );
};

export default PaperSubmit;