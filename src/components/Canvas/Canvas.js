import './Canvas.css';

import React, { Component } from 'react';

export class Canvas extends Component {

  state = {
    mouse: {
      x: undefined,
      y: undefined
    },
    animFrame: ''
  }

  animFrame = '';
  circleArray = [];

  componentDidMount() {
    this.init();
    this.animate();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animFrame);
  }

  animate = () => {
    this.animFrame = requestAnimationFrame(this.animate);
    this._cvs.getContext('2d').clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (window.innerWidth !== this._cvs.width && window.innerHeight !== this._cvs.width) {
      console.log('resized');
      this._cvs.width = window.innerWidth;
      this._cvs.height = window.innerHeight;
    }

    this.circleArray.forEach(function(el) {
      el.update();
    });
  }

  init = () => {
    const canvas = this._cvs;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var c = canvas.getContext('2d');

    const mouse = {...this.state.mouse}

    for (var i = 0; i < 10; i++ ) {
      let radius = Math.random() * (5 - 3) + 3;
      let x = Math.random() * (window.innerWidth - radius * 2) + radius;
      let y = Math.random() * (window.innerHeight - radius * 2) + radius;
      let dy = (Math.random() - 0.5 * 5);
      let dx = (Math.random() - 0.5 * 5);
      this.circleArray.push(new this.Circle(x, y, dx, dy, radius, c, mouse));
    }
  }

  Circle(x, y, dx, dy, radius, c, mouse) {

    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = 10;
    this.minRadius = radius;
    this.maxRadius = Math.random() * (40 - 20) + 20;
    var color = [];

    for (var i = 0; i < 3; i++) {
      color.push(Math.floor(Math.random() * 255));
    }

    color = 'rgba(' + color.toString() + ',1)';

    this.draw = function() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      c.fillStyle = color;
      c.fill();
    };

    this.update = function() {
      if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
        this.dx = -this.dx;
      }

      if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
        this.dy = -this.dy;
      }

      this.x += this.dx;
      this.y += this.dy;

      // interactivity
      // if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
      //   if (this.radius < this.maxRadius) {
      //     this.radius +=2;
      //   }
      // } else if (this.radius > this.minRadius) {
      //   this.radius -=2;
      // }

      this.draw();
    };
  }

  render() {

    return (
      <canvas className="canvas" id="canvas" ref={cvs => this._cvs = cvs}></canvas>
    );
  }
}

export default Canvas;
