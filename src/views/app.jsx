var React = require('react');
var Level = require('./level.jsx');
var MAP_DATA = require('../constants/map');
var LEVELS = require('../constants/levels');

var App = React.createClass({
    getInitialState: function() {
        return {
            currLevel: 0
        }
    },
    render: function() {
        var styles = {
            width: MAP_DATA.width,
            height: MAP_DATA.height,
            backgroundColor: '#e4e4e4'
        };
        var items = LEVELS[this.state.currLevel].items;
        return (
            <div style={styles}>
                <Level items={items} map={MAP_DATA} />
            </div> 
        );
    }
});

module.exports = App;
