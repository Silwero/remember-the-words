import './Overlay.css';

import React from 'react';

const Overlay = (props) => (
  <div className="overlay" onClick={e => props.click(e.target)}></div>
);

export default Overlay;