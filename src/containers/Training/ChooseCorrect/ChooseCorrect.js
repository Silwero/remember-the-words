import './ChooseCorrect.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomInput, Row, Col, FormGroup, Button } from 'reactstrap';
import {randomInteger} from '../../../supportFunctions/supportFunctions';

import TestCounters from '../../../components/TestCounters/TestCounters';

export class ChooseCorrect extends Component {
  state = {
    currentSource: 'word',
    currentTranslation: 'слово',
    currentVariants: ['конфета', 'баклажан', 'терять'],
    answer: '',
    numberOfAnswersVariants: 3,
    errors: 0,
    rightAnswers: 0,
    numberOfQuestions: 0,
    timer: 700,
    prevAnswer: ''
  }

  componentDidMount() {
    this.createTest();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.translations !== this.props.translations) {
      this.createTest(nextProps.translations);
    }
  }

  createTest = (translations = this.props.translations) => {
    if (!Object.keys(translations).length) return;

    // source translation
    let keys = Object.keys(translations);
    let keyNumber = randomInteger(0, keys.length - 1);
    let currentSource = keys[keyNumber];

    if (currentSource === this.state.prevAnswer) {
      this.createTest();
      return;
    }

    keys.splice(keyNumber, 1);

    // translation variants
    let currentVariants = [];
    for (let i = 0; i < this.state.numberOfAnswersVariants; i++) {
      let variantKeyNumber = randomInteger(0, keys.length - 1);
      let currentVariant = keys[variantKeyNumber];
      currentVariants.push(translations[currentVariant].translation.translation);
      keys.splice(variantKeyNumber, 1);
    }

    currentVariants.splice(randomInteger(0, this.state.numberOfAnswersVariants - 1), 0, translations[currentSource].translation.translation);

    this.setState({
      currentSource: translations[currentSource].translation.source,
      currentTranslation: translations[currentSource].translation.translation,
      currentVariants: currentVariants,
      prevAnswer: currentSource
    });
  }

  removeWrongVariant = (variant = this.state.answer) => {
    let newCurrentVariants = [...this.state.currentVariants];

    newCurrentVariants = newCurrentVariants.filter((el) => {
      return el !== variant.value;
    });

    this.setState({
      currentVariants: newCurrentVariants
    });
  }

  checkAnswer = e => {
    if (!this.state.answer) return;
    e.preventDefault();
    const btn = e.target;
    btn.disabled = true;

    const target = this.state.answer;
    if (target.value === this.state.currentTranslation) {
      target.classList.add('correct');

      setTimeout(() => {
        this.createTest();
        this.setState((state) => ({
          answer: '',
          rightAnswers: state.rightAnswers + 1,
          numberOfQuestions: state.numberOfQuestions + 1
        }));
        target.classList.remove('correct');
        btn.disabled = false;
      }, this.state.timer);
    } else {
      target.classList.add('mistake');

      setTimeout(() => {
        target.classList.remove('mistake');
        btn.disabled = false;
        this.setState((state) => ({
          errors: state.errors + 1
        }), this.removeWrongVariant);
      }, this.state.timer);
    }
  }

  render() {

    let answers = this.state.currentVariants.map((el, i) => {
      return <Col key={i} sm={6}>
                <FormGroup>
                  <CustomInput onChange={e => {this.setState({answer: e.target})}} checked={this.state.answer.value === el} type="radio" id={'answer-' + i} value={el} name="answer" label={el} />
               </FormGroup>
            </Col>
    });

    return (
      <div className="choose-correct">
        <h1>Choose correct answer</h1>
        {
          Object.keys(this.props.translations).length > 10
          ? <div className="choose-correct-answer training-wrapper">
              <div className="training-source">
                {this.state.currentSource}
              </div>
              <Row>
                {answers}
              </Row>
              <FormGroup className="text-center">
                <Button color="primary" onClick={this.checkAnswer}>Check</Button>
              </FormGroup>
              <TestCounters
                rightAnswers={this.state.rightAnswers}
                numberOfQuestions={this.state.numberOfQuestions}
                errors={this.state.errors} />
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