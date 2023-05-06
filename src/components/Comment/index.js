import React from 'react';
import {Row, Col, Card,Button} from 'react-bootstrap';
import jwt_decode from "jwt-decode";

const Comment = (props) => {
    const {id, createdDate,createdBy, text, emitDeleteComment, jwt} = props
    const decode_jwt = jwt_decode(jwt)
    return (
      <Card style={{ width: '100%' }}>
        
      <Card.Body>
            <Row>
            <Card.Title>{createdBy}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{createdDate}</Card.Subtitle>
            <Card.Text>
            {text}
            </Card.Text>
            {
            decode_jwt.sub === createdBy ? 
            <>
           <Col>
           <Button  variant="danger" size='small' onClick={() => emitDeleteComment(id)}>Delete</Button>
            </Col>
            </> : <></>
            }
          </Row>




      </Card.Body>

        </Card>

    );
};

export default Comment;