var React = require('react');
var Item = require('./item.jsx');

var Elevator = React.createClass({
    arrow: function(isDown, size, color) {
        var styles = {
            width: 0,
            height: 0,
            borderLeft: size + 'px solid transparent',
            borderRight: size + 'px solid transparent',
            margin: '0 auto',
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)'
        };
        var borderStyle = size + 'px solid ' + color;
        if (isDown) {
            styles.borderTop = borderStyle;
        } else {
            styles.borderBottom = borderStyle;
        }
        return <div style={styles} />;
    },
    render: function() {
    	var styles = {
            position: this.props.position || 'absolute',
            boxShadow: 'inset 0px 0px 0px 1px brown'
    	};
        var arrow = this.arrow(this.props.isGoingDown, 10, 'orange');
        return (
            <Item style={styles} {...this.props}>
                {arrow}
            </Item>
        );
    }
});

module.exports = Elevator;
