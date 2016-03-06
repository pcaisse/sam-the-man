var React = require('react');
var Level = require('./level.jsx');
var MAP_DATA = require('../constants/map');
var LEVELS = require('../constants/levels');

var App = React.createClass({
    getInitialState: function() {
        return {
            currLevel: 0,
            showSplashScreen: true,
        };
    },
    render: function() {
        var content = this.state.showSplashScreen ? this.splashScreen() : this.game();
        return (
            <div>
                {content}
            </div>
        );
    },
    splashScreen: function() {
        var styles = {
            backgroundColor: 'lightblue',
            width: MAP_DATA.width,
            height: MAP_DATA.height
        };
        var titleStyles = {
            margin: '0 auto',
            width: 150,
            textAlign: 'center',
            fontFamily: "'Courier New',Courier,monospace",
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)'
        }
        return (
            <div style={styles} onClick={this.start}>
                <div style={titleStyles}>
                    <div>Sam the Man</div>
                    <br/>
                    <div>START</div>
                </div>
            </div>
        );
    },
    start: function() {
        this.setState({showSplashScreen: false});
    },
    game: function() {
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
