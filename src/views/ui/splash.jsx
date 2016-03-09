var React = require('react');
var Link = require('react-router').Link;

var MAP = require('../../constants/map');

var SplashScreen = React.createClass({
    render: function() {
        var styles = {
            backgroundColor: 'lightblue',
            width: MAP.width,
            height: MAP.height
        };
        var titleStyles = {
            margin: '0 auto',
            width: 150,
            textAlign: 'center',
            fontFamily: "'Courier New',Courier,monospace",
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)'
        };
        return (
            <div style={styles} onClick={this.start}>
                <div style={titleStyles}>
                    <div>Sam the Man</div>
                    <br/>
                    <div><Link to='/level/'>START</Link></div>
                </div>
            </div>
        );
    }
});

module.exports = SplashScreen;
