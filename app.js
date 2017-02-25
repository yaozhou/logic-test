import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, useRouterHistory, hashHistory, browserHistory } from 'react-router';
import { createHashHistory } from 'history';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
//require ('./components/jquery')


const History = useRouterHistory(createHashHistory)();
// let store = createStore(reducer) ;

import Cover from './components/Cover' ;
import Puzzle from './components/Puzzle'
import Ranking from './components/Ranking'
import Score from './components/Score'
import Container from './components/Container'
import Wx from './components/Wx'
import Prize from './components/Prize'

import store from './components/store'

import { init_state, reducer } from './components/reducer'

let element = document.getElementById('reactEntry');
ReactDOM.render(( 
        <Provider store={store}>
        <Router history={hashHistory}>

            <Route path="/" component={Wx} />
            <Route path="/app" component={Container} >
                <IndexRoute components={Cover} />
                <Route path="/puzzle" component={Puzzle} />
                <Route path="/score" component={Score} />
                <Route path="/ranking" component={Ranking} />
                <Route path="/cover" component={Cover} />
                <Route path="/Prize" component={Prize} />

            </Route>
        </Router>
        </Provider>
  ), element) ;