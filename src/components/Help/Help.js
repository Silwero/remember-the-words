import React from 'react';

const Help = (props) => (
  <button onClick={props.click} disabled={props.isDisabled} className="help-btn hover-line">
    {props.label} ({props.used})
  </button>
);

export default Help;
