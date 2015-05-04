var React = require('react');

React.initializeTouchEvents(true);

var App = require('./views/app.jsx');
var MapData = require('./mapData');

React.render(
    <App mapData={MapData} />, 
    document.getElementById('main')
);