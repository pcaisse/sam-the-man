var React = require('react');

React.initializeTouchEvents(true);

var App = require('./views/app.jsx');

React.render(
    <App />, 
    document.getElementById('main')
);