var React = require('react');
var Item = require('./item.jsx');

var mapUtils = require('../../utils/map');

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
    toggleDirection: function() {
        if (this.props.isPlacementMode && this.props.isInventoryItem) {
            // Toggle elevator direction
            this.props.editItem(this.props.id, {
                isGoingDown: !this.props.isGoingDown
            });
        }
    },
    render: function() {
    	var styles = {
            position: this.props.position || 'absolute',
            boxShadow: 'inset 0px 0px 0px 1px brown'
    	};
        var arrow = this.arrow(this.props.isGoingDown, 10, 'orange');
        var toggleDirection = this.toggleDirection;
        var onTouchEnd = this.props.onTouchEnd;
        var onTouchMove = this.props.onTouchMove;
        var wasTouchMoved = false;
        var props = Object.assign({}, this.props, {
            onTouchMove: function(event) {
                onTouchMove(event);
                wasTouchMoved = true;
            },
            onTouchEnd: function(event) {
                onTouchEnd(event);
                if (!wasTouchMoved) {
                    // Elevator has not been moved, only touched (tapped)
                    toggleDirection();
                }
            },
            onClick: this.toggleDirection,
        });
        return (
            <Item style={styles} {...props}>
                {arrow}
            </Item>
        );
    }
});

module.exports = Elevator;
