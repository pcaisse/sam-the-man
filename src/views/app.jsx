var React = require('react');

var Level = require('./level.jsx');
var MAP = require('../constants/map');
var LEVELS = require('../constants/levels');

var App = React.createClass({
    render: function() {
        var styles = {
            width: MAP.width,
            height: MAP.height,
            backgroundColor: '#e4e4e4'
        };
        var currLevel = this.props.params.currLevel || 0;
        var items = LEVELS[currLevel].items;
        var inventory = LEVELS[currLevel].inventory;
        return (
            <div style={styles}>
                <Level items={items} map={MAP} inventory={inventory} currLevel={currLevel} />
            </div> 
        );
    }
});

module.exports = App;
