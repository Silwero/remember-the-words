import './InputTranslations.css';
import '../../../assets/css/keyboard.css';

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

  componentWillMount() {
    this.createTest();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.currentSource) this.createTest(nextProps.translations);
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

    });
  }

  showLetter = () => {
    let test = this.state.answer.split('');
    for (let i = 0; i < this.state.currentTranslation.length; i++) {
      if (this.state.showedLetters[i]) {
        test[i] = this.state.showedLetters[i];
      }
    }

    if (this.state.showedLetters.join('') === this.state.currentTranslation || test.join('') === this.state.currentTranslation) {
      this.showAnswer();
      return;
    }

    const letterNum = randomInteger(0, this.state.currentTranslation.length - 1);
    const letter = this.state.currentTranslation[letterNum];

    const newShowedLetters = [...this.state.showedLetters];

    if (!newShowedLetters[letterNum] && this.state.answer[letterNum] !== this.state.currentTranslation[letterNum]) {
      newShowedLetters[letterNum] = letter;
    } else {
      this.showLetter();
      return;
    }
    this.setState( state => ({
      showedLetters: newShowedLetters,
      letterShowed: state.letterShowed + 1
    }), () => {

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

      }, this.state.timer);
    }
  }

  showAnswer = (e) => {
    this.setState((state) => ({
      answer: state.currentTranslation,
      answerShowed: state.answerShowed + 1
    }), this._input.focus());
  }

  setCorrect = (e, num) => {
    const target = e.target;
    if (!target.classList.contains('with-tipp') || !target.classList.contains('mistake')) return;

    let newAnswer = [...this.state.answer.split('')];

    if (this.state.answer[num] !== this.state.currentTranslation[num]) {
      newAnswer.splice(num, 1,  this.state.currentTranslation[num]);
      this.setState({
        answer: newAnswer.join('')
      });
    }
  }

  keyboardEvent = (e) => {
    console.log(e);
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
      return <div onClick={(e) => this.setCorrect(e, i)} className={clName + (this.state.showedLetters[i] ? ' with-tipp' : '')} key={i} data-tipp={this.state.showedLetters[i] ? this.state.showedLetters[i] : ''}>
        {this.state.answer[i] || null}
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
                onBlur={() => {this._input.focus()}}
                // autoFocus="true"
                innerRef={(input) => (this._input = input)}/>
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
