import './MyTranslations.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Translation from '../../components/Translation/Translation';
import * as actions from '../../store/actions/actions';
import { Input, FormGroup, Label } from 'reactstrap';

export class MyTranslations extends Component {
  state = {
    sortBy: ''
  }

  toggleVariats = (target) => {
    target.parentElement.classList.toggle('variants-visible');
  }

  deleteTranslate = (deleteName) => {
    this.props.deleteTranslate(deleteName, this.props.idToken);
  }

  findTranslation = e => {
    this.setState({
      sortBy: e.target.value
    });
  }

  render() {
    let myTranslations = <p className="empty">No saved translations!</p>

    let translationResult = Object.keys(this.props.translations).filter((el) => {
      const rExp = new RegExp(this.state.sortBy, 'gi');
      return rExp.test(this.props.translations[el].translation.source) || rExp.test(this.props.translations[el].translation.translation);
    });

    if (translationResult.length) {
      myTranslations = translationResult.map((el, i) => {
        return <Translation target={el} delete={this.deleteTranslate} click={this.toggleVariats} key={i} translation={this.props.translations[el].translation} />
      });
    }

    return (
      <div className="my-translations">
        <h1>My Translations</h1>
        <div className="translation-sort">
          <FormGroup>
            <Label>Find</Label>
            <Input type="text" value={this.state.sortBy} onChange={this.findTranslation} />
          </FormGroup>
        </div>
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