(function (scope) {
"use strict";

var ICTJAM3 = scope.ICTJAM3;
var Phaser = scope.Phaser;

ICTJAM3.Game = function () {
};

ICTJAM3.Game.prototype = {
	create: function () {
        this.sprite = this.add.sprite(this.world.centerX, this.world.centerY, 'ok');
        this.sprite.anchor.setTo(0.5, 0.5);
	},

	update: function () {
        this.sprite.angle++;
	}
};

})(this);
