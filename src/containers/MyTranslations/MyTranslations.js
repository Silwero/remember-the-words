import './MyTranslations.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Translation from '../../components/Translation/Translation';
import * as actions from '../../store/actions/actions';

export class MyTranslations extends Component {

  toggleVariats = (target) => {
    target.parentElement.classList.toggle('variants-visible');
  }

  deleteTranslate = (deleteName) => {
    this.props.deleteTranslate(deleteName, this.props.idToken);
  }

  render() {
    let myTranslations = <p className="empty">No saved translations!</p>

    if (Object.keys(this.props.translations).length) {
      myTranslations = Object.keys(this.props.translations).map((el, i) => {
        return <Translation target={el} delete={this.deleteTranslate} click={this.toggleVariats} key={i} translation={this.props.translations[el].translation} />
      });
    }

    return (
      <div className="my-translations">
        <h1>My Translations</h1>
        <div className="tanslations-list">
          <div className="translations-list-tanslation">
            <div className="translation-source translation-th">
              Source
            </div>
            <div className="translation-result translation-th">
              Translation
            </div>
          </div>
          {myTranslations}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    translations: state.translations,
    idToken: state.userInfo.idToken
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteTranslate: (name, token) => dispatch(actions.deleteTranslate(name, token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTranslations);