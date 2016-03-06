var Block = require('../models/block');
var Man = require('../models/man');
var Elevator = require('../models/elevator');

var MAP = require('../constants/map');

function Items() {
    this.count = 0;
    for (var i = 0; i < arguments.length; i++) {
        this.add(arguments[i]);
    }
    return this;
}

Items.prototype = Object.create(Array.prototype);

Items.prototype.itemCollidesWithItemWhere = function(item, conditionFunc) {
    return this.filter(function(currItem) {
        return !item.isSameAs(currItem) && item.collidesWith(currItem) && conditionFunc(currItem, item);
    })[0];
};

Items.prototype.enterableItemWhichContainsItem = function(item) {
    return this.filter(function(currItem) {
        return !item.isSameAs(currItem) && currItem.isEnterable && item.hasSamePosition(currItem);
    })[0];
};

Items.prototype.droppableItemWalkedOnByItem = function(item) {
    return this.filter(function(currItem) {
        return !item.isSameAs(currItem) && currItem.isDroppable && currItem.walkingOnItem &&
            currItem.walkingOnItem.isSameAs(item);
    })[0];
};

Items.prototype.update = function() {
    this.forEach(function(item, index, items) {
        var canContinueToFall = item.canFall && this.canContinueTo('fall', item, items,
            function(currItem, item) {
                return (currItem.isCollidable && !(currItem.canWalk && item.canWalk)) || currItem.isEnterable;
            });
        if (item.canWalk) {
            var droppableItemWalkedOnByItem = items.droppableItemWalkedOnByItem(item);
            if (droppableItemWalkedOnByItem && (!canContinueToFall.collisionItem ||
                    !canContinueToFall.collisionItem.isSameAs(droppableItemWalkedOnByItem))) {
                // Item has walked off of droppable item
                droppableItemWalkedOnByItem.onWalkedOff();
            }
        }
        if (item.canFall && !item.isWaiting && canContinueToFall.canContinue) {
            // Item can continue falling
            item.fall();
        } else if (item.canWalk && !item.isWaiting) {
            var enterableItemWhichContainsItem = items.enterableItemWhichContainsItem(item);
            if (enterableItemWhichContainsItem && !enterableItemWhichContainsItem.isEntered()) {
                // Tell entered item that it has been entered
                enterableItemWhichContainsItem.onEntered(item);
            }
            if (canContinueToFall.collisionItem && canContinueToFall.collisionItem.isDroppable &&
                    !canContinueToFall.collisionItem.walkingOnItem) {
                // Item is walking on droppable item
                canContinueToFall.collisionItem.onWalkedOn(item);
            }
            if (!item.isWaiting) {
                var canContinueToWalk = this.canContinueTo('walk', item, items,
                    function(currItem) {
                        return currItem.isCollidable && !currItem.canWalk;
                    });
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
            var canContinueToMoveVertically = this.canContinueTo('moveVertically', item, items,
                function(currItem, item) {
                    return currItem.isCollidable && !item.enteredItem.isSameAs(currItem);
                });
            if (canContinueToMoveVertically.canContinue) {
                // Item can continue to move vertically
                item.moveVertically();
            } else {
                item.stop();
            }
        }
    }.bind(this));
};

Items.prototype.canContinueTo = function(itemFuncName, item, items, conditionFunc) {
    // Clone item and put it in its future state to see if it is valid
    var futureItem = Object.assign({}, item);
    futureItem[itemFuncName].call(futureItem);
    // Perform checks
    var collisionItem = items.itemCollidesWithItemWhere(futureItem, conditionFunc);
    return {
        canContinue: futureItem.isWithinMapBounds() && !collisionItem,
        collisionItem: collisionItem
    };
};

Items.prototype.add = function(item) {
    // Scale
    ['top', 'left', 'width', 'height'].forEach(function(measure) {
        item[measure] *= MAP.unit;
    });
    // Validate
    if (!(item instanceof Block) && !(item instanceof Elevator) && !(item instanceof Man)) {
        throw new TypeError('Items in level must be of valid types.');
    }
    var isCellTaken = this.some(function(currItem) {
        return item.collidesWith(currItem);
    });
    if (isCellTaken) {
        throw new TypeError('There is already an item occupying that position.');
    }
    // Give unique id
    item.id = this.count++;
    // Add item
    this.push(item);
};

module.exports = Items;
