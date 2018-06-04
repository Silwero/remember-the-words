import './Message.css';

import React from 'react';
import { Container } from 'reactstrap';

const Message = (props) => (
  <div className={'message ' + props.type}>
    <Container>
      {props.message}
    </Container>
  </div>
);

export default Message;