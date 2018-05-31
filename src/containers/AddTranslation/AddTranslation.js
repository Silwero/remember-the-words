import React, { Component } from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';

export class AddTranslation extends Component {
  state = {
    source: 'test',
    translation: 'проверка',
    variants: '',
    isEmpty: false
  }

  inputHandler = (e) => {
    const key = e.target.id;

    this.setState({
      [key]: e.target.value.toLowerCase()
    }, this.isDisabled);
  }

  clearInputs = (e) => {
    if (e) e.preventDefault();

    this.setState({
      source: '',
      translation: '',
      variants: ''
    }, this.isDisabled);
  }

  isDisabled = () => {
    if (this.state.source && this.state.translation) {
      this.setState({
        isEmpty: false
      });
    } else {
      this.setState({
        isEmpty: true
      });
    }
  }

  saveTranslation = (e) => {
    e.preventDefault();

    const translation = {
      source: this.state.source,
      translation: this.state.translation,
      variants: ''
    }

    if (this.state.variants.length) {
      translation.variants = this.state.variants.split(',').map(el => {
        return el.trim()
      });
    }

    const data = {
      user: {
        userId: this.props.userId,
        idToken: this.props.idToken
      },
      translation: translation
    }

    this.props.saveTranslation(data, (resp) => {
      if (resp) this.clearInputs();
    });
  }

  render() {
    return (
      <div className="add-translation">
        <h1>Add translation</h1>
        <Form className="centered-form">
          <Row>
            <Col sm={6}>
              <FormGroup>
                <Label>Source text <span className="required text-danger">*</span></Label>
                <Input type="text"
                  id="source"
                  onChange={this.inputHandler}
                  value={this.state.source}
                  placeholder="Enter text to translate" />
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup>
                <Label>Translation <span className="required text-danger">*</span></Label>
                <Input type="text"
                  id="translation"
                  onChange={this.inputHandler}
                  value={this.state.translation}
                  placeholder="Enter translation" />
              </FormGroup>
            </Col>
            <Col sm={12}>
              <FormGroup>
                <Label>Other variants</Label>
                <Input type="textarea"
                  id="variants"
                  onChange={this.inputHandler}
                  value={this.state.variants}
                  placeholder="Other variants separated by commas" />
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup>
                <Button block color="danger" onClick={this.clearInputs}>Clear</Button>
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup>
                <Button block color="primary" disabled={this.state.isEmpty} onClick={this.saveTranslation}>Save translation</Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.userInfo.userId,
    idToken: state.userInfo.idToken
  }
}

const mapDispatchToProps = dispatch => {
  return {
    saveTranslation: (data, callback) => dispatch(actions.saveTranslation(data, callback))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTranslation);
