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
        var canContinueToFall = item.canFall && this.canContinueTo('fall', item, items, 'isEnterable');
        if (item.canFall && !item.isWaiting && canContinueToFall.canContinue) {
            // Item can continue falling
            item.fall();
        } else if (item.canWalk && !item.isWaiting) {
            var enterableItemWhichContainsItem = items.enterableItemWhichContainsItem(item);
            if (enterableItemWhichContainsItem && !enterableItemWhichContainsItem.isEntered()) {
                // Tell entered item that it has been entered
                enterableItemWhichContainsItem.onEntered(item);
            }
            if (canContinueToFall.collisionItem && canContinueToFall.collisionItem.isDroppable) {
                // Item is walking on droppable item
                canContinueToFall.collisionItem.drop();
            }
            if (!item.isWaiting) {
                var canContinueToWalk = this.canContinueTo('walk', item, items);
                if (canContinueToWalk.canContinue) {
                    // Item can continue walking
                    item.walk();
                    if (enterableItemWhichContainsItem && enterableItemWhichContainsItem.isUnloading) {
                        // Tell entered item that contained item has exited
                        enterableItemWhichContainsItem.onExited();
                    }
                } else {
                    item.turn();
                }
            }
        } else if (item.canMoveVertically && !item.isStopped) {
            var canContinueToMoveVertically = this.canContinueTo('moveVertically', item, items);
            if (canContinueToMoveVertically.canContinue) {
                // Item can continue to move vertically
                item.moveVertically();
            } else {
                item.stop();
            }
        }
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
        var collisionItem = items.itemCollidesWithItemWhere(futureItem, props);
        return {
            canContinue: futureItem.isWithinMapBounds() && !collisionItem,
            collisionItem: collisionItem
        };
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
