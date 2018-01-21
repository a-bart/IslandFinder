import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import Slider from 'material-ui/Slider';

import './styles.css';

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      errors: {
        rows: null,
        cols: null
      }
    }
  }

  checkDimension = (field, value) => {
    if (!value) {
      return this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          [field]: 'Заполните это поле'
        }
      }));
    }

    if (value < 2) {
      return this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          [field]: 'Значение должно быть не меньше 2'
        }
      }));
    }

    this.setState(prevState => ({
      errors: {
        ...prevState.errors,
        [field]: null
      }
    }));
  };

  render() {
    const {
      rows, cols, fillRandomly, animation, animationSpeed,
      setRows, setCols, changeFillRandomly, changeAnimation, changeAnimationSpeed,
      generateMap
    } = this.props;

    return (
      <div className='settings'>
        <h2 className="header">Настройки</h2>
        <div className="form">
          <div className="form-element">
            <div className="sizes">
              <div>
                <span className="element-title">Ширина</span>
                <TextField
                  id="1"
                  value={cols}
                  onInput={(e)=>{
                    e.target.value = Math.max(0, parseInt(e.target.value, 10) ).toString().slice(0,2);
                    setCols(e.target.value);
                    this.checkDimension('cols' ,e.target.value);
                  }}
                  min={1}
                  type="number"
                  errorText={this.state.errors.cols}
                />
              </div>
              <div>
                <span className="element-title">Высота</span>
                <TextField
                  id="2"
                  value={rows}
                  onInput={(e)=>{
                    e.target.value = Math.max(0, parseInt(e.target.value, 10) ).toString().slice(0,2);
                    setRows(e.target.value);
                    this.checkDimension('rows' ,e.target.value)
                  }}
                  min={1}
                  type="number"
                  errorText={this.state.errors.rows}
                />
              </div>
            </div>
          </div>
          <div className="form-element">
            <Checkbox
              label="Заполнить карту островами рандомно?"
              labelPosition="left"
              labelStyle={{
                fontSize: '18px',
                fontWeight: 700,
                fontFamily: 'inherit'
              }}
              checked={fillRandomly}
              onCheck={() => {
                changeFillRandomly(!fillRandomly)
              }}
            />
          </div>
          <div className="form-element">
            <Checkbox
              label="Выполнять поиск островов с анимацией?"
              labelPosition="left"
              labelStyle={{
                fontSize: '18px',
                fontWeight: 700,
                fontFamily: 'inherit'
              }}
              checked={animation}
              onCheck={(event, isInputChecked) => {
                changeAnimation(!animation);

                if (!isInputChecked) {
                  changeAnimationSpeed(1);
                }
              }}
            />
          </div>
          <div className="form-element">
            <span className="element-title">Скорость поиска</span>
            <Slider
              min={1}
              max={100}
              step={1}
              disabled={!animation}
              value={animationSpeed}
              sliderStyle={{
                marginTop: 10,
                marginBottom: 0
              }}
            />
          </div>
          <RaisedButton
            label="Сгенерировать"
            backgroundColor="#fedd61"
            fullWidth
            onClick={() => {
              this.checkDimension('rows', rows);
              this.checkDimension('cols', cols);

              if (this.state.errors.cols || this.state.errors.rows) {
                return;
              }

              generateMap()
            }}
          />
        </div>
      </div>
    );
  }
}

export default Settings;
