(function (scope) {
"use strict";

var ICTJAM3 = scope.ICTJAM3;

ICTJAM3.StateSaver = function () {
    this.currentMap = null;
    this.npc1 = null;
    this.anotherRandomTHing = null;
};

ICTJAM3.StateSaver.prototype = {
    get: function (entry) {
        return this[entry];
    },

    set: function (entry, value) {
        this[entry] = value;
    }
};

})(this);
