import React, { Component } from 'react';

export class AdditionalVariants extends Component {
  toggleHeight = (e) => {
    e.target.classList.toggle('all-showed');
  }

  render() {
    return (
      <div className="additional-variants container-sm" onClick={this.toggleHeight}>
        {this.props.variants ? this.props.variants.join(', ') : null}
      </div>
    );
  }
}

export default AdditionalVariants;