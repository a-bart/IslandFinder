import React, { Component } from 'react';
import classNames from 'classnames';
import './styles.css';

class Block extends Component {
  render() {
    const {
      block, x, y, changeBlock,
      isFinding, currentPosition, foundIslands,
      animation
    } = this.props;

    const current = animation && isFinding && x === currentPosition[1] && y === currentPosition[0];
    const coveredIslandPart = foundIslands.some(island => {
      return island.some(el => el[0] === y && el[1] === x);
    });

    const blockClass = classNames({
      'block': true,
      'current': current,
      'foundPart': !current && coveredIslandPart,
      'plain': !(current && coveredIslandPart) && block === 0,
      'island': !(current && coveredIslandPart) && block === 1
    });

    return (
      <div
        className={blockClass}
        onClick={() => {changeBlock(block, x, y)}}
      />
    )
  }
}

export default Block;