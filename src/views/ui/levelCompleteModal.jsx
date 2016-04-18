var React = require('react');
var Link = require('react-router').Link;

var LevelCompleteModal = React.createClass({
    render: function() {
        var styles = {
            backgroundColor: 'lightblue',
            margin: '0 auto',
            width: 150,
            textAlign: 'center',
            fontFamily: "Courier New",
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: parseInt(this.props.mapDimensions.unit / 2),
        };
        var link = this.props.isLastLevel ? null : <Link to={'/level/' + this.props.nextLevel}>NEXT LEVEL</Link>
        var msg = this.props.isLastLevel ? "Congratulations!" : "Level Complete!"
        return (
            <div style={styles}>
                <span>{msg}</span>
                <br/>
                <div>{link}</div>
            </div>
        );
    }
});

module.exports = LevelCompleteModal;
