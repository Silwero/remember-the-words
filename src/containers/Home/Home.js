import './Home.css';

import React, { Component } from 'react';

export class Home extends Component {
  render() {
    return (
      <div className="home">
        <h1>Remember The Words</h1>
        <div className="home-description">
          <p><strong>Remember The Words</strong> is an online application for help in memorizing words. Add translations and repeat the words in the workouts. Also access to training is possible in offline mode, if you are not logged out.</p>
        </div>
      </div>
    );
  }
}

export default Home;
