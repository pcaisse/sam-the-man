var React = require('react');
var Level = require('./level.jsx');
var MapData = require('../constants/mapData');

var App = React.createClass({
    getInitialState: function() {
        return {
            currLevel: 0
        }
    },
    render: function() {
        var map = MapData.map;
        var styles = {
            width: map.width,
            height: map.height,
            backgroundColor: '#e4e4e4'
        };
        var items = MapData.levels[this.state.currLevel].items;
        return (
            <div style={styles}>
                <Level items={items} map={map} />
            </div> 
        );
    }
});

module.exports = App;
