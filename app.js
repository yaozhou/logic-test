import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, useRouterHistory, hashHistory, browserHistory } from 'react-router';
import { createHashHistory } from 'history';


const History = useRouterHistory(createHashHistory)();

import Cover from './components/Cover' ;
import Puzzle from './components/Puzzle'
import Ranking from './components/Ranking'
import Score from './components/Score'
import Container from './components/Container'
import Wx from './components/Wx'
import Prize from './components/Prize'
import AdminLogin from './components/Admin/AdminLogin'
import Admin from './components/Admin'
import Audio from './components/Audio'

let element = document.getElementById('reactEntry');
//let cover_wx = (<Wx state='cover'>) ;
ReactDOM.render(( 
        <Router history={hashHistory}>

            <Route path="/" component={() => (<Wx state='cover' />)} />
            <Route path="/audio" component={Audio} />
            <Route path="/prize" component={() => (<Wx state='prize_noauth' />)} />
            <Route path="/app" component={Container} >  
                <IndexRoute components={Cover} />
                <Route path="/puzzle" component={Puzzle} />
                <Route path="/score" component={Score} />
                <Route path="/ranking" component={Ranking} />
                <Route path="/cover" component={Cover} />
                <Route path="/prize_noauth" component={Prize} />
                <Route path="/login" component={AdminLogin} />
                <Route path="/admin" component={Admin} />
                
            </Route>
        </Router>
  ), element) ;