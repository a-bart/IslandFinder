import React, { Component } from 'react';
import './styles.css';

class Block extends Component {
  render() {
    const {
      block, x, y, changeBlock
    } = this.props;

    return (
      <div
        className={'block ' + (block === 0 ? 'plain' : 'island')}
        onClick={() => {changeBlock(block, x, y)}}
      />
    )
  }
}

export default Block;