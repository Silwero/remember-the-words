import './HamburgerBtn.css';

import React from 'react';

const HamburgerBtn = (props) => (
  <div onClick={(e) => props.click(e.currentTarget)} className="hamburger hamburger--elastic">
    <div className="hamburger-box">
      <div className="hamburger-inner"></div>
    </div>
  </div>
);

export default HamburgerBtn;