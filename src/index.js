import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './styles/index.css';
import App from './components/App';

const target = document.getElementById('root');

render(
  <MuiThemeProvider>
    <App/>
  </MuiThemeProvider>,
  target
);
