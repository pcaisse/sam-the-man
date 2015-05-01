var React = require('react');

React.initializeTouchEvents(true);

var App = require('./jsx/app.jsx');

React.render(
    React.createElement(App), 
    document.getElementById('main')
);