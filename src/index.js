import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';


import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from './store/reducers/reducers';

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

const app = <Provider store={store}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</Provider>;

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
