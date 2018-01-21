import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import './styles.css';

import Block from '../Block';
import IslandFinder from '../../lib/islandFinder';

class Map extends Component {
  constructor() {
    super();
    this.state = {
      isFinding: false,
      foundIslands: [],
    }
  }

  find = (map) => {
    console.log('начать поиск');

    const inslandFinder = new IslandFinder(map);

    this.setState({
      isFinding: true,
    });

    this.state.foundIslands = inslandFinder.islands;

    inslandFinder.find();

    console.log('Острова: ', this.state.foundIslands);

    this.setState({
      isFinding: false
    });
  };

  render() {
    const {
      map, changeBlock
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
                />
              })}
            </div>)
          })}
          <div className="stats">
            <RaisedButton
              label="Найти острова"
              backgroundColor="#fedd61"
              fullWidth
              disabled={this.state.isFinding}
              onClick={async () => {
                await this.find(map);
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Map;
