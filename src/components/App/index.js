import React, { Component } from 'react';

import Map from '../Map';
import Settings from '../Settings';

import './styles.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      map: null,
      block: {
        size: 0
      },
      settings: {
        rows: '',
        cols: '',
        fillRandomly: false,
        animation: false,
        animationSpeed: 1
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
        animationSpeed
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

      this.setState({ map });
    }
  };

  changeBlock = (currentValue, x, y) => {
    console.log(`currentValue: ${currentValue}`);
    console.log(`x: ${x}`);
    console.log(`y: ${y}`);
    let map = [...this.state.map];
    map[y][x] = currentValue === 0 ? 1 : 0;
    this.setState({ map });
  };

  render() {
    const {
      settings: {
        rows, cols, fillRandomly, animation, animationSpeed
      },
      map, block
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
        />
        <Map
          map={map}
          changeBlock={this.changeBlock}
        />
      </div>
    );
  }
}

export default App;
