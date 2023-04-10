import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './assets/fontawesome-free-5.15.4-web/css/all.min.css'

import store from "./redux/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
     <Provider store={store}>
          <BrowserRouter>
               <App />
          </BrowserRouter>
     </Provider>
);