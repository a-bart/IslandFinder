import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import './styles.css';

import Block from '../Block';
import IslandFinder from '../../lib/islandFinder';

class Map extends Component {
  constructor() {
    super();
  }

  find = async (map) => {
    const delay = this.props.animation ? this.props.duration : 0;
    const islandFinder = new IslandFinder(map, delay);

    this.props.resetFinder();
    this.props.setFinding(true);

    if (this.props.animation) {
      this.checkFinder(islandFinder);
    }
    await islandFinder.find();

    this.props.setFinding(false);
    this.props.setFinished(true);

    if (!this.props.animation) {
      this.props.setFinder(islandFinder.islands, islandFinder.currentPosition);
    }
  };

  checkFinder = (islandFinder) => {
    const interval = setInterval(() => {
      if (!this.props.isFinding) {
        clearInterval(interval);
      }

      this.props.setFinder(islandFinder.islands, islandFinder.currentPosition)
    }, 50)
  };

  getIslandEnding = (countString) => {
    if (countString.length === 2 && +countString[0] === 1) {
      return 'ов';
    }

    if (+countString[countString.length-1] === 1) {
      return '';
    } else if (+countString[countString.length-1] >= 2 && +countString[countString.length-1] <= 4) {
      return 'а';
    } else {
      return 'ов';
    }
  };

  renderResult = () => {
    const count = this.props.foundIslands.length;
    const countString = count.toString();

    if (count === 0) {
      return 'Островов на карте нет'
    }

    const ending = this.getIslandEnding(countString);

    return `Найден${+countString[countString.length-1] === 1 ? '' : 'о'} ${count} остров${ending}`;
  };

  render() {
    const {
      map, changeBlock, isFinding, foundIslands, currentPosition,
      animation, finished
    } = this.props;

    return (
      <div className='map'>
        <h2 className="header">Карта</h2>
        <div className={'mapArea ' + (map && map.length > 0 ? 'show' : 'hidden')}>
          {map && map.length > 0 && map.map((row, rowIndex) => {
            return (<div key={rowIndex} className="row">
              {row.map((block, blockIndex) => {
                return <Block
                  key={blockIndex}
                  block={block}
                  x={blockIndex}
                  y={rowIndex}
                  changeBlock={changeBlock}
                  currentPosition={currentPosition}
                  foundIslands={foundIslands}
                  isFinding={isFinding}
                  animation={animation}
                  finished={finished}
                />
              })}
            </div>)
          })}
          <div className="stats">
            <RaisedButton
              label="Найти острова"
              backgroundColor="#fedd61"
              fullWidth
              disabled={isFinding}
              onClick={async () => {
                await this.find(map);
              }}
            />
            <div>
              <Snackbar
                open={finished}
                message={this.renderResult()}
                autoHideDuration={4000}
                // onRequestClose={this.handleRequestClose}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Map;
