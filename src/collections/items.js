var Block = require('../models/items/block');
var BreakableBlock = require('../models/items/breakableBlock');
var DroppableBlock = require('../models/items/droppableBlock');
var Man = require('../models/items/man');
var Elevator = require('../models/items/elevator');
var Goal = require('../models/items/goal');

var mapUtils = require('../utils/map');

/**
 * Enumerator for item movement function names.
 * @type {Object.<string, string>}
 */
var MOVEMENTS_FUNCS = {
    WALK: 'walk',
    FALL: 'fall',
    MOVE_VERTICALLY: 'moveVertically'
};

/**
 * Used to tell if the item can continue its current action (walking, falling, etc).
 * @type {Object.<string, function>}
 */
var CAN_CONTINUE_FUNCS = {};
CAN_CONTINUE_FUNCS[MOVEMENTS_FUNCS.FALL] = function(currItem, item) {
    return (currItem.isCollidable && !(currItem.canWalk && item.canWalk)) || currItem.isEnterable;
},
CAN_CONTINUE_FUNCS[MOVEMENTS_FUNCS.WALK] = function(currItem) {
    return currItem.isCollidable && !currItem.canWalk;
},
CAN_CONTINUE_FUNCS[MOVEMENTS_FUNCS.MOVE_VERTICALLY] = function(currItem, item) {
    return currItem.isCollidable && !item.enteredItem.isSameAs(currItem) || currItem.isEnterable;
}

function Items() {
    this.count = 0;
    for (var i = 0; i < arguments.length; i++) {
        this.add(arguments[i]);
    }
    return this;
}

Items.prototype = Object.create(Array.prototype);

/**
 * Instead of pushing items onto the array, they are added so that checks and mutations can occur before pushing.
 * @param {Object} item Item to be added.
 */
Items.prototype.add = function(item) {
    // Validate
    if (!(item instanceof Block) && !(item instanceof Elevator) && !(item instanceof Man) && !(item instanceof Goal) &&
            !(item instanceof BreakableBlock) && !(item instanceof DroppableBlock)) {
        throw new TypeError('Items in level must be of valid types.');
    }
    if (this.isCellTaken(item)) {
        throw new TypeError('There is already an item occupying that position.');
    }
    // Give unique id
    item.id = this.count++;
    // Add item
    this.push(item);
};

Items.prototype.remove = function(id) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].id === parseInt(id)) {
            this.splice(i, 1);
            return;
        }
    }
};

Items.prototype.isCellTaken = function(item) {
    return this.some(function(currItem) {
        return item.collidesWith(currItem);
    });
};

Items.prototype.find = function(id) {
    return this.filter(function(item) {
        return item.id === id;
    })[0];
};

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

Items.prototype.acheivableItemWhichContainsItem = function(item) {
    return this.filter(function(currItem) {
        return !item.isSameAs(currItem) && currItem.isAchievable && item.hasSamePosition(currItem);
    })[0];
};

Items.prototype.droppableOrBreakableItemWalkedOnByItem = function(item) {
    return this.filter(function(currItem) {
        return !item.isSameAs(currItem) && (currItem.isDroppable || currItem.isBreakable) && currItem.walkingOnItem &&
            currItem.walkingOnItem.isSameAs(item);
    })[0];
};

Items.prototype.breakableItemCollidedWithItem = function(item) {
    return this.filter(function(currItem) {
        return currItem.isCollidable && currItem.isBreakable && !currItem.isBroken;
    })[0];
}

Items.prototype.isGoalAchieved = function() {
    return this.filter(function(currItem) {
        return currItem.isAchievable;
    }).every(function(achievableItem) {
        return achievableItem.isAchieved;
    });
};

/**
 * Update all items in collection based on their properties, current state, and relation to one another.
 * NB: This is where the magic happens!
 */
Items.prototype.update = function() {
    this.forEach(function(item) {
        var canContinueToFall = item.canFall && this.canContinueTo(MOVEMENTS_FUNCS.FALL, item);
        if (item.canWalk) {
            var droppableOrBreakableItemWalkedOnByItem = this.droppableOrBreakableItemWalkedOnByItem(item);
            if (droppableOrBreakableItemWalkedOnByItem && (!canContinueToFall.collisionItem ||
                    !canContinueToFall.collisionItem.isSameAs(droppableOrBreakableItemWalkedOnByItem))) {
                // Item has walked off of droppable/breakable item
                droppableOrBreakableItemWalkedOnByItem.onWalkedOff();
            }
        }
        if (item.canFall && !item.isWaiting && canContinueToFall.canContinue) {
            // Item can continue falling
            item.fall();
        } else if (item.canWalk && !item.isWaiting) {
            var acheivableItemWhichContainsItem = this.acheivableItemWhichContainsItem(item);
            if (acheivableItemWhichContainsItem) {
                // Item has achieved the goal!
                acheivableItemWhichContainsItem.onAchieved();
            } else {
                var enterableItemWhichContainsItem = this.enterableItemWhichContainsItem(item);
                if (enterableItemWhichContainsItem && !enterableItemWhichContainsItem.isOccupied()) {
                    // Tell entered item that it has been entered
                    enterableItemWhichContainsItem.onEntered(item);
                }
                if (canContinueToFall.collisionItem && (canContinueToFall.collisionItem.isDroppable ||
                        canContinueToFall.collisionItem.isBreakable) &&
                        !canContinueToFall.collisionItem.walkingOnItem) {
                    // Item is walking on droppable/breakable item
                    canContinueToFall.collisionItem.onWalkedOn(item);
                }
                if (!item.isWaiting) {
                    var canContinueToWalk = this.canContinueTo(MOVEMENTS_FUNCS.WALK, item);
                    if (canContinueToWalk.canContinue) {
                        // Item can continue walking
                        item.walk();
                        if (enterableItemWhichContainsItem && enterableItemWhichContainsItem.isUnloading) {
                            // Tell entered item that contained item has begun to exit
                            enterableItemWhichContainsItem.onExitStart();
                        }
                    } else {
                        var breakableItemCollidedWithItem = this.breakableItemCollidedWithItem(item);
                        if (breakableItemCollidedWithItem) {
                            // Breakable item has been collided with
                            breakableItemCollidedWithItem.onCollided();
                        }
                        // Avoid non-stop flipping if the item is stuck
                        var canContinueToWalkOtherDirection = this.canContinueTo(MOVEMENTS_FUNCS.WALK, item.turn());
                        if (!canContinueToWalkOtherDirection.canContinue) {
                            // There's nowhere to go, so reverse our preview-turn
                            item.turn();
                        }
                    }
                }
            }
        } else if (item.canMoveVertically && !item.isStopped) {
            var canContinueToMoveVertically = this.canContinueTo(MOVEMENTS_FUNCS.MOVE_VERTICALLY, item);
            if (canContinueToMoveVertically.canContinue) {
                // Item can continue to move vertically
                item.moveVertically();
            } else {
                item.stop();
            }
        }
    }.bind(this));
};

/**
 * Check if the item can continue its current action (walking, falling, etc).
 * @param  {string} funcName Name of function to be called.
 * @param  {Object} item Item in question.
 * @return {Object} Contains result of check and collision item, if any.
 */
Items.prototype.canContinueTo = function(funcName, item) {
    // Put item in its future state to see if it is valid
    item[funcName](true);
    // Perform checks
    var collisionItem = this.itemCollidesWithItemWhere(item, CAN_CONTINUE_FUNCS[funcName]);
    var canContinue = mapUtils.isWithinMapBounds(item.decimalTop(), item.decimalLeft()) && !collisionItem;
    // Reverse changes
    item.unmove();
    return {
        canContinue: canContinue,
        collisionItem: collisionItem
    };
};

Items.prototype.copy = function() {
    var items = this.map(function(item) {
        var type = item.constructor;
        return new type(item._data);
    });
    items.unshift(null);
    return new (Function.prototype.bind.apply(Items, items))();
};

module.exports = Items;
