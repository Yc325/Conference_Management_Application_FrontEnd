import React from 'react';
import { useLocalState } from '../util/useLocalStorage';
import NavBar from '../components/NavBar';
import { Row,Col, Button } from 'react-bootstrap';
import { Slider } from '../components/Carousel';
const HomePage = () => {
    const [jwt,setJwt] = useLocalState("","jwt")

    return (
        <>
        <NavBar jwt = {jwt}/>
        <div>
            <Slider/>

        </div>
        </>
    );
};

export default HomePage;