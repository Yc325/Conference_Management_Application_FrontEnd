import React from 'react';
import {Dropdown,Card,Button} from 'react-bootstrap';

const DropDownComponent = (props) => {
    const {id, type, msg, sender,paper,emitReadNotification, date} = props

    return (
        <Dropdown.Item>
    <Card>
      <Card.Body>
        <Card.Title>{sender}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted"><bold>Paper</bold>:{paper}({type})</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted"><bold>{date}</bold></Card.Subtitle>
        <Card.Text>
        {msg.slice(0, 20) + (msg.length > 20 ? "..." : "")}
        </Card.Text>
        <Button size="sm"onClick={() => emitReadNotification(id)}>Mark as read</Button>
        <Button style={{margin:"1px"}}size="sm"
        onClick={()=>{
        window.location.href= `/papers/${paper}/view`}}
        >View</Button>
      </Card.Body>
    </Card>

        </Dropdown.Item>


    );
};

export default DropDownComponent;