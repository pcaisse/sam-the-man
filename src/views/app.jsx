var React = require('react');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var hashHistory = require('react-router').hashHistory;

var Game = require('./game.jsx');
var Splash = require('./ui/splash.jsx');
var mapUtils = require('../utils/map');

var App = React.createClass({

    statics: {
        // Routes must be static to avoid react-router error
        routes: [
            <Route path="/" component={Splash} />,
            <Route path="level" component={Game} />,
            <Route path="level/:currLevel" component={Game} />
        ]
    },

    getInitialState: function() {
        return {
            mapDimensions: mapUtils.findMapDimensions()
        };
    },

    componentDidMount: function() {
        window.onresize = function() {
            this.setState({
                mapDimensions: mapUtils.findMapDimensions()
            });
        }.bind(this);
    },

    createWithDefaultProps: function(Component, props) {
        return <Component {...props} mapDimensions={this.state.mapDimensions} />;
    },

    render: function() {
        return (
            <Router history={hashHistory} routes={App.routes} createElement={this.createWithDefaultProps} />
        );
    }
});

module.exports = App;
