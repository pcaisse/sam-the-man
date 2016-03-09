var React = require('react');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var hashHistory = require('react-router').hashHistory;

var Splash = require('./views/ui/splash.jsx');
var App = require('./views/app.jsx');

React.initializeTouchEvents(true);

React.render(
    <Router history={hashHistory}>
        <Route path="/" component={Splash}/>
        <Route path="level" component={App}/>
        <Route path="level/:currLevel" component={App}/>
    </Router>,
    document.getElementById('main')
);
