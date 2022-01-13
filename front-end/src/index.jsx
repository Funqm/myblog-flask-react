import 'antd/dist/antd.css'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {BrowserRouter, HashRouter, Link, Routes, Route } from 'react-router-dom'
import Ping from './components/Ping';
import App from './App';
import Register from './routes/Register';
import Login from './routes/Login';
import Profile from './routes/profile';
import store from './store';
import reportWebVitals from './reportWebVitals';



ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path='register' element={<Register/>} />
        <Route path='login' element={<Login />} />
        <Route path='profile/:userId' element={<Profile />}></Route>
      </Route>
    </Routes>
  </HashRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
