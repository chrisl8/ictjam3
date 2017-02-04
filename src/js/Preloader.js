(function (scope) {
"use strict";

var ICTJAM3 = scope.ICTJAM3;
var Phaser = scope.Phaser;

ICTJAM3.Preloader = function () {
	this.ready = false;
};

ICTJAM3.Preloader.prototype = {
	preload: function () {
        this.game.load.spritesheet('mom', 'img/Mom.png', 32, 32);
        this.game.load.image('ok', 'img/ok.png');

        this.game.load.image('temp_tiles', 'img/temp_tiles.png');
        this.game.load.tilemap('test_map', 'map/test_map.json', null, Phaser.Tilemap.TILED_JSON);
	},

	create: function () {
        this.game.state.start('Game');
	}
};

})(this);
