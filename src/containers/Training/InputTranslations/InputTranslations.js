import './InputTranslations.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {randomInteger} from '../../../supportFunctions/supportFunctions';
import TestCounters from '../../../components/TestCounters/TestCounters';
import { Input, Button, FormGroup, Label, Form } from 'reactstrap';
import Help from '../../../components/Help/Help';
import AdditionalVariants from '../../../components/AdditionalVariants/AdditionalVariants';

export class InputTranslations extends Component {
  state = {
    currentSource: '',
    currentTranslation: '',
    answer: '',
    errors: 0,
    rightAnswers: 0,
    numberOfQuestions: 0,
    timer: 700,
    showedLetters: [],
    prevAnswer: '',
    variants: '',
    answerShowed: 0,
    letterShowed: 0
  }

  componentDidMount() {
    this.createTest();
  }

  componentWillReceiveProps(nextProps) {
    this.createTest(nextProps.translations);
  }

  createTest = (translations = this.props.translations) => {
    if (!Object.keys(translations).length) return;

    let keys = Object.keys(translations);
    let keyNumber = randomInteger(0, keys.length - 1);
    let currentSource = keys[keyNumber];

    if (currentSource === this.state.prevAnswer && Object.keys(translations).length > 1) {
      this.createTest();
      return;
    }


    let showedLetters = [];
    translations[currentSource].translation.translation.split('').forEach(() => {
      showedLetters.push(null);
    });

    this.setState({
      currentSource: translations[currentSource].translation.translation,
      currentTranslation: translations[currentSource].translation.source,
      showedLetters: showedLetters,
      prevAnswer: currentSource,
      variants: translations[currentSource].translation.variants
    }, () => {
      this._input.focus();
    });
  }

  showLetter = () => {
    if (this.state.showedLetters.join('') === this.state.currentTranslation) {
      this._input.focus();
      return;
    }

    const letterNum = randomInteger(0, this.state.currentTranslation.length - 1);
    const letter = this.state.currentTranslation[letterNum];

    const newShowedLetters = [...this.state.showedLetters];

    if (!newShowedLetters[letterNum]) {
      newShowedLetters[letterNum] = letter;
    } else {
      this.showLetter();
      return;
    }
    this.setState( state => ({
      showedLetters: newShowedLetters,
      letterShowed: state.letterShowed + 1
    }), () => {
      this._input.focus();
      if (this.state.showedLetters.join('') === this.state.currentTranslation) this.showAnswer();
    });
  }

  changeAnswerHandler = e => {
    if (e.target.value.length > this.state.currentTranslation.length) return;

    this.setState({
      answer: e.target.value.toLowerCase()
    });
  }

  checkAnswer = e => {
    e.preventDefault();
    const target = e.target;
    target.parentNode.parentNode.classList.add('testing');
    target.disabled = true;
    if (this.state.answer === this.state.currentTranslation) {
      setTimeout(() => {
        this.setState(state => ({
          numberOfQuestions: state.numberOfQuestions + 1,
          rightAnswers: state.rightAnswers + 1,
          answer: ''
        }), this.createTest);
        target.disabled = false;
        target.parentNode.parentNode.classList.remove('testing');
      }, this.state.timer);
    } else {
      setTimeout(() => {
        this.setState(state => ({
          errors: state.errors + 1
        }));
        target.disabled = false;
        target.parentNode.parentNode.classList.remove('testing');
        this._input.focus();
      }, this.state.timer);
    }
  }

  showAnswer = (e) => {
    this.setState((state) => ({
      answer: state.currentTranslation,
      answerShowed: state.answerShowed + 1
    }), this._input.focus());
  }

  render() {
    let answerResult = this.state.currentTranslation.split('').map((letter, i) => {
      let clName = 'letter'
      if (letter === ' ') clName += ' space';
      if (letter === this.state.answer[i]) {
        clName += ' correct'
      } else if (this.state.answer[i] && letter !== this.state.answer[i]) {
        clName += ' mistake'
      }
      return <div className={clName} key={i}>
        {this.state.answer[i] ? this.state.answer[i] : this.state.showedLetters[i] || null}
      </div>;
    });

    return (
      <div className="input-translation">
        <h1>Input translation</h1>
        <div className="training-input-translation training-wrapper">
          <div className="helps">
            <Help label="Show Answer"
                  isDisabled={this.state.currentTranslation === this.state.answer}
                  used={this.state.answerShowed}
                  click={this.showAnswer} />
            <Help label="Show Letter"
                  isDisabled={this.state.currentTranslation === this.state.answer}
                  used={this.state.letterShowed}
                  click={this.showLetter} />
          </div>
          <div className="training-source">
            {this.state.currentSource}
            <AdditionalVariants variants={this.state.variants} />
          </div>
          <Form onSubmit={this.checkAnswer}>
            <FormGroup className="container-sm">
              <Label>Enter answer here</Label>
              <Input type="text"
                id="answer"
                value={this.state.answer}
                autoComplete="off"
                onChange={this.changeAnswerHandler}
                autoFocus="true"
                innerRef={(input) => (this._input = input)} />
            </FormGroup>
            <FormGroup>
              <div className="answer-result">
                {answerResult}
              </div>
            </FormGroup>
            <FormGroup className="container-sm">
              <Button block disabled={this.state.answer.length !== this.state.currentTranslation.length} color="primary" onClick={this.checkAnswer}>Check</Button>
            </FormGroup>
          </Form>
          <TestCounters
                rightAnswers={this.state.rightAnswers}
                numberOfQuestions={this.state.numberOfQuestions}
                errors={this.state.errors} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    translations: state.translations
  }
}

export default connect(mapStateToProps)(InputTranslations);
