(function (scope) {
"use strict";

var ICTJAM3 = scope.ICTJAM3;

ICTJAM3.StateSaver = function () {
    this.currentMap = null;
    this.currentRandomNpcPosition = 0;
    this.randomNpcPositions = [{ x: 117, y: 175  }, { x: 208, y: 141  }, { x: 195, y: 357  }, { x: 355, y: 276  }, { x: 599, y: 201  }];
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
