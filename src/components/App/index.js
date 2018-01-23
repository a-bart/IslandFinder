import React, { Component } from 'react';

import Map from '../Map';
import Settings from '../Settings';

import './styles.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      map: null,
      settings: {
        rows: '',
        cols: '',
        fillRandomly: false,
        animation: false,
        animationSpeed: 50,
        duration: 1000
      },
      isFinding: false,
      finder: {
        foundIslands: [],
        currentPosition: [0,0],
        finished: false
      }
    };
  }

  setRows = (rows) => {
    this.setState(prevState => ({
      settings: {
        ...prevState.settings,
        rows: +rows
      }
    }));
  };

  setCols = (cols) => {
    this.setState(prevState => ({
      settings: {
        ...prevState.settings,
        cols: +cols
      }
    }));
  };

  changeFillRandomly = (fillRandomly) => {
    this.setState(prevState => ({
      settings: {
        ...prevState.settings,
        fillRandomly
      }
    }));
  };

  changeAnimation = (animation) => {
    this.setState(prevState => ({
      settings: {
        ...prevState.settings,
        animation
      }
    }));
  };

  changeAnimationSpeed = (animationSpeed) => {
    this.setState(prevState => ({
      settings: {
        ...prevState.settings,
        animationSpeed,
        duration: 1050 - animationSpeed
      }
    }));
  };

  resetFinder = () => {
    this.setState({
      finder: {
        foundIslands: [],
        currentPosition: [0,0],
        finished: false
      }
    });
  };

  setFinder = (islands, position) => {
    this.setState(prevState => ({
      finder: {
        ...prevState.finder,
        foundIslands: islands,
        currentPosition: position
      }
    }));
  };

  generateMap = () => {
    console.log('generate map');

    const map = [];

    const getRandom = (min, max) => {
      const rand = Math.random() * (max - min) + min;
      // сокращаем шансы выпадения единицы
      if (rand < 0.80) {
        return 0
      } else {
        return 1
      }
    };

    for (let i = 0; i < this.state.settings.rows; i++) {
      let arr = new Array(this.state.settings.cols).fill(0);

      if (this.state.settings.fillRandomly) {
        arr = arr.map(e => getRandom(0,1));
      }
      map.push(arr);

      this.setState({
        map
      });
      this.resetFinder();
    }
  };

  changeBlock = (currentValue, x, y) => {
    console.log(`currentValue: ${currentValue}`);
    console.log(`x: ${x}`);
    console.log(`y: ${y}`);
    let map = [...this.state.map];
    map[y][x] = currentValue === 0 ? 1 : 0;

    this.setState(prevState => ({
      map,
      finder: {
        ...prevState.finder,
        finished: false
      }
    }));
  };

  setFinding = (finding) => {
    this.setState({
      isFinding: finding
    })
  };

  setFinished = (status) => {
    this.setState(prevState => ({
      finder: {
        ...prevState.finder,
        finished: status
      }
    }));
  };

  render() {
    const {
      settings: {
        rows, cols, fillRandomly, animation, animationSpeed, duration
      },
      map, isFinding,
      finder: {
        foundIslands, currentPosition, finished
      }
    } = this.state;
    return (
      <div className='app'>
        <Settings
          rows={rows}
          cols={cols}
          fillRandomly={fillRandomly}
          animation={animation}
          animationSpeed={animationSpeed}
          setRows={this.setRows}
          setCols={this.setCols}
          changeFillRandomly={this.changeFillRandomly}
          changeAnimation={this.changeAnimation}
          changeAnimationSpeed={this.changeAnimationSpeed}
          generateMap={this.generateMap}
          isFinding={isFinding}
        />
        <Map
          map={map}
          changeBlock={this.changeBlock}
          isFinding={isFinding}
          setFinding={this.setFinding}
          animation={animation}
          duration={duration}
          setFinder={this.setFinder}
          foundIslands={foundIslands}
          currentPosition={currentPosition}
          finished={finished}
          setFinished={this.setFinished}
          resetFinder={this.resetFinder}
        />
      </div>
    );
  }
}

export default App;
