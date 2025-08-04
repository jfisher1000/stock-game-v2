import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorker from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

// Correctly importing the 'store' object that is exported from './store/index'
import { store } from "./store/index";

const getId : any = document.getElementById('root');
const root = ReactDOM.createRoot(getId);

root.render(
    // The store is passed to the Redux Provider
    <Provider store={store}>
      <React.Fragment>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.Fragment>
    </Provider>
);

serviceWorker.unregister();
