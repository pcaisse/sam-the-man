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
        if (item.canFall && !item.hasEntered && !this.itemCollidesWithEnterableItem(item, items) &&
                this.canContinueTo('fall', item, items)) {
            item.fall();
        } else if (item.canWalk && !item.hasEntered) {
            if (!this.canContinueTo('walk', item, items)) {
                var enteredEnterableItem = this.emptyEnteredEnterableItems(item, items)[0];
                if (enteredEnterableItem) {
                    enteredEnterableItem.onEntered(item);
                } else {
                    item.turn();
                }
            } else {
                item.walk();
            }
        } else if (item.canMoveVertically && !item.isStopped) {
            if (this.canContinueTo('moveVertically', item, items)) {
                item.moveVertically();
            } else if (!item.enteredItem) {
                item.onExited();
            } else {
                item.enteredItem.onExit();
            }
        }
    },

    // TODO: Make these functions into methods on an Items collection
    itemCollidesWithEnterableItem: function(item, items) {
        return items.filter(function(currItem) {
            return currItem.isEnterable && currItem !== item;
        }).some(function(collidableItem) {
            return item.collidesWith(collidableItem);
        });
    },

    itemCollidesWithCollidableItem: function(item, items) {
        return items.filter(function(currItem) {
            return currItem.isCollidable && currItem !== item;
        }).some(function(collidableItem) {
            return item.collidesWith(collidableItem);
        });
    },

    emptyEnteredEnterableItems: function(item, items) {
        return items.filter(function(currItem) {
            if (currItem.isEnterable && !currItem.enteredItem && currItem !== item) {
                return item.hasSamePosition(currItem);
            }
        });
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

    canContinueTo: function(funcName, item, items) {
        var futureItem = Object.assign({}, item);
        futureItem[funcName].call(futureItem);
        return this.itemIsWithinMapBounds(futureItem) && !this.itemCollidesWithCollidableItem(futureItem, items);
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
