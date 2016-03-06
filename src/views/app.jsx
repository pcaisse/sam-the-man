var React = require('react');

var Level = require('./level.jsx');
var MAP_DATA = require('../constants/map');
var LEVELS = require('../constants/levels');

var App = React.createClass({
    render: function() {
        var styles = {
            width: MAP_DATA.width,
            height: MAP_DATA.height,
            backgroundColor: '#e4e4e4'
        };
        var currLevel = this.props.params.currLevel || 0;
        var items = LEVELS[currLevel].items;
        var inventory = LEVELS[currLevel].inventory;
        return (
            <div style={styles}>
                <Level items={items} map={MAP_DATA} inventory={inventory} />
            </div> 
        );
    }
});

module.exports = App;
