import React, { Component } from 'react';
import classNames from 'classnames';
import './styles.css';

class Block extends Component {
  constructor() {
    super();
    this.state = {
      clicked: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isFinding === true) {
      this.setState({
        clicked: false
      })
    }
  }

  render() {
    const {
      block, x, y, changeBlock,
      isFinding, currentPosition, foundIslands,
      animation, finished
    } = this.props;

    const current = animation && isFinding && x === currentPosition[1] && y === currentPosition[0];
    const coveredIslandPart = foundIslands.some(island => {
      return island.some(el => el[0] === y && el[1] === x);
    });

    const blockClass = classNames({
      'block': true,
      'current': current,
      'foundPart': !current && !this.state.clicked && coveredIslandPart,
      'plain': !(current && coveredIslandPart) && block === 0,
      'island': !(current && coveredIslandPart) && block === 1
    });

    return (
      <div
        className={blockClass}
        onClick={() => {
          if (!isFinding) {
            changeBlock(block, x, y);

            this.setState({
              clicked: true
            })
          }
        }}
      />
    )
  }
}

export default Block;