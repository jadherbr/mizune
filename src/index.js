import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Routes from './routes';
import { Provider } from 'react-redux';
import store from './store';
import './styles.css';
import 'antd/dist/antd.css';

ReactDOM.render(
  <Provider store={store}>
    <Routes>
      <App />
    </Routes>
  </Provider>
  , document.getElementById('root'));

