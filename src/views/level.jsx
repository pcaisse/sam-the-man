var React = require('react');
var Man = require('./man.jsx');
var Block = require('./block.jsx');
var Elevator = require('./elevator.jsx');

var models = require('../models');

var Level = React.createClass({

    getInitialState: function() {
        return {
            items: this.props.items
        };
    },

    componentDidMount: function() {
        window.requestAnimationFrame(this.update);
    },

    update: function() {
        var items = this.state.items;
        items.forEach(this.updateItem);
        this.setState(items);
        window.requestAnimationFrame(this.update);
    },

    updateItem: function(item, index, items) {
        if (item.canFall && !item.isWaiting && this.canContinueTo('fall', item, items, 'isEnterable')) {
            item.fall();
        } else if (item.canWalk && !item.isWaiting) {
            var enterableItemWhichContainsItem = this.enterableItemWhichContainsItem(item, items);
            if (enterableItemWhichContainsItem && !enterableItemWhichContainsItem.enteredItem) {
                enterableItemWhichContainsItem.onEntered(item);
            }
            if (!item.isWaiting) {
                if (this.canContinueTo('walk', item, items)) {
                    item.walk();
                    if (enterableItemWhichContainsItem && enterableItemWhichContainsItem.isUnloading) {
                        enterableItemWhichContainsItem.onExited();
                    }
                } else {
                    item.turn();
                }
            }
        } else if (item.canMoveVertically && !item.isStopped) {
            if (this.canContinueTo('moveVertically', item, items)) {
                item.moveVertically();
            } else {
                item.stop();
            }
        }
    },

    // TODO: Make these functions into methods on an Items collection
    itemCollidesWithItemWhere: function(item, items, props) {
        return items.filter(function(currItem) {
            return currItem !== item && props.some(function(prop) {
                return currItem[prop];
            });
        }).some(function(collidableItem) {
            return item.collidesWith(collidableItem);
        });
    },

    enterableItemWhichContainsItem: function(item, items) {
        return items.filter(function(currItem) {
            if (currItem.isEnterable && currItem !== item) {
                return item.hasSamePosition(currItem);
            }
        })[0];
    },

    itemIsWithinMapY: function(item) {
        return item.top >= 0 && item.top <= this.props.map.height - item.height;
    },

    itemIsWithinMapX: function(item) {
        return item.left >= 0 && item.left <= this.props.map.width - item.width;
    },

    itemIsWithinMapBounds: function(item) {
        return this.itemIsWithinMapX(item) && this.itemIsWithinMapY(item);
    },

    canContinueTo: function(funcName, item, items, extraProps) {
        // By default, cannot continue action if item will collide with a collidable item
        var props = ['isCollidable'];
        if (extraProps) {
            props = props.concat(extraProps);
        }
        // Clone item and put it in its future state to see if it is valid
        var futureItem = Object.assign({}, item);
        futureItem[funcName].call(futureItem);
        // Perform checks
        return this.itemIsWithinMapBounds(futureItem) && !this.itemCollidesWithItemWhere(futureItem, items, props);
    },

    modelsToComponents: function(model, Component) {
        return this.props.items.filter(function(item) {
            return item instanceof model;
        }).map(function(item, index) {
            return <Component key={index} {...item} />;
        });
    },

    render: function() {
        var styles = {
            position: 'relative',
            width: this.props.map.width,
            height: this.props.map.height,
        };
        return (
            <div style={styles}>
                {this.modelsToComponents(models.Man, Man)}
                {this.modelsToComponents(models.Block, Block)}
                {this.modelsToComponents(models.Elevator, Elevator)}
            </div> 
        );
    },
});

module.exports = Level;
