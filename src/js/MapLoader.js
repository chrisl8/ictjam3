(function (scope) {
"use strict";

var ICTJAM3 = scope.ICTJAM3;
var Phaser = scope.Phaser;

var EXISTING_MAPS = [
    "0_0",
    "1_0",
    "0_1",
    "0_2",
    "0_3",
    "-1_0",
    "-1_1",
    
];

ICTJAM3.MapLoader = function (loader) {
    this.loader = loader;
};

ICTJAM3.MapLoader.prototype = {
    loadMapAtCoord: function (x, y, callback, callbackContext) {
        var coordString = x + "_" + y;
        if (EXISTING_MAPS.indexOf(coordString) !== -1) {
            this.loader.tilemap("map_" + coordString, "map/at_" + coordString + ".json", null, Phaser.Tilemap.TILED_JSON);
        } else {
            this.loader.tilemap("map_failsafe", "map/at_failsafe.json", null, Phaser.Tilemap.TILED_JSON);
            coordString = 'failsafe';
        }
        var callbackFunc = callback.bind(callbackContext);
        this.loader.onLoadComplete.addOnce(function () { callbackFunc(coordString); });
        this.loader.start();
    }
};

})(this);
