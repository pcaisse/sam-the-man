var React = require('react');
var Link = require('react-router').Link;

var MAP = require('../../constants/map');

var Modal = React.createClass({
    render: function() {
        var styles = {
            backgroundColor: 'lightblue',
            margin: '0 auto',
            width: 150,
            textAlign: 'center',
            fontFamily: "'Courier New',Courier,monospace",
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: parseInt(MAP.unit / 2),
        };
        var toNextLevelLink = '/level/' + this.props.nextLevel;
        return (
            <div style={styles}>
                <span>{this.props.text}</span>
                <br/>
                <div><Link to={toNextLevelLink}>NEXT LEVEL</Link></div>
            </div>
        );
    }
});

module.exports = Modal;
