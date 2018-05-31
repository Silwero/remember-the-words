import React, { Component } from 'react';
import { connect } from 'react-redux';

export class ChooseCorrect extends Component {
  state = {
    currentSource: 'word',
    currentTranslation: 'слово',
    currentWariants: ['some', 'other', 'variants', 'yes']
  }

  render() {
    return (
      <div className="choose-correct">
        <h1>Choose correct answer</h1>
        {
          Object.keys(this.props.translations).length > 10
          ? <div className="choose-correct-answer">
              <div className="choose-correct-source">
                {this.state.currentSource}
              </div>
              <div className="form-item">
                <input type="checkbox"/>
                <label>{this.state.currentWariants[0]}</label>
              </div>
              <div className="form-item">
                <input type="checkbox"/>
                <label>{this.state.currentWariants[1]}</label>
              </div>
              <div className="form-item">
                <input type="checkbox"/>
                <label>{this.state.currentWariants[2]}</label>
              </div>
              <div className="form-item">
                <input type="checkbox"/>
                <label>{this.state.currentWariants[3]}</label>
              </div>
          </div>
          : <p className="empty">Need have more then 10 saved words</p>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    translations: state.translations
  }
}

export default connect(mapStateToProps)(ChooseCorrect);