import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import './styles.css';

import Block from '../Block';
import IslandFinder from '../../lib/islandFinder';

class Map extends Component {
  constructor() {
    super();
    this.state = {
      stopped: false
    };
  }

  find = async (map) => {
    const delay = this.props.animation ? this.props.duration : 0;
    const islandFinder = new IslandFinder(map, delay);

    this.props.resetFinder();
    this.props.setFinding(true);

    if (this.props.animation) {
      this.checkFinder(islandFinder);

      try {
        await islandFinder.findAsync();

        this.props.setFinding(false);
        this.props.setFinished(true);
      } catch (err) {
        if (err.message === 'stopped') {
          this.props.resetFinder();
          this.props.setFinding(false);
          this.setState({ stopped :false });
        } else {
          throw err
        }
      }
    } else {
      islandFinder.find();
      this.props.setFinder(islandFinder.islands, islandFinder.currentPosition);
      this.props.setFinding(false);
      this.props.setFinished(true);
    }
  };

  checkFinder = (islandFinder) => {
    const interval = setInterval(() => {
      if (!this.props.isFinding) {
        clearInterval(interval);
      }

      if (this.state.stopped) {
        islandFinder.stop();
        clearInterval(interval);
      }

      this.props.setFinder(islandFinder.islands, islandFinder.currentPosition)
    }, 50)
  };

  getWords = (countString) => {
    const words = ['Найден', 'остров'];

    if (countString.length === 2 && +countString[0] === 1) {
      words[0] += 'о';
      words[1] += 'ов';
      return words;
    }

    if (+countString[countString.length-1] === 1) {
      return words;
    } else if (+countString[countString.length-1] >= 2 && +countString[countString.length-1] <= 4) {
      words[0] += 'о';
      words[1] += 'а';
      return words;
    } else {
      words[0] += 'о';
      words[1] += 'ов';
      return words;
    }
  };

  renderResult = () => {
    const count = this.props.foundIslands.length;
    const countString = count.toString();

    if (count === 0) {
      return 'Островов на карте нет'
    }

    const words = this.getWords(countString);

    return `${words[0]} ${count} ${words[1]}`;
  };

  render() {
    const {
      map, changeBlock, isFinding, foundIslands, currentPosition,
      animation, finished, resultShowed, setResultShowed
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
            {!isFinding && (
              <RaisedButton
                label="Найти острова"
                backgroundColor="#fedd61"
                fullWidth
                disabled={isFinding}
                onClick={async () => {
                  await this.find(map);
                }}
              />
            )}
            {isFinding && (
              <RaisedButton
                label="Остановить"
                backgroundColor="#FF6464"
                fullWidth
                disabled={!isFinding}
                onClick={() => {
                  console.log('stop button clicked');
                  this.setState({
                    stopped: true
                  });
                }}
              />
            )}

            <div>
              <Snackbar
                open={finished && !resultShowed}
                message={this.renderResult()}
                autoHideDuration={4000}
                onRequestClose={() => {setResultShowed(true)}}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Map;
