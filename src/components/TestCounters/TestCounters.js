import React from 'react';
import { Row, Col } from 'reactstrap';
import'./TestCounters.css';

const TestCounters = (props) => (
  <div className="test-counters">
    <Row>
      <Col className="wrong-answers" md={4}>
        Mistakes: <strong>{props.errors}</strong>
      </Col>
      <Col className="counter-answers" md={4}>
        Question: <strong>{props.numberOfQuestions}</strong>
      </Col>
      <Col className="right-answers" md={4}>
        Right answers: <strong>{props.rightAnswers}</strong>
      </Col>
    </Row>
  </div>
);

export default TestCounters;