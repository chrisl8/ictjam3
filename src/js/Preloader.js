(function (scope) {
"use strict";

var ICTJAM3 = scope.ICTJAM3;
var Phaser = scope.Phaser;

ICTJAM3.Preloader = function () {
	this.ready = false;
};

ICTJAM3.Preloader.prototype = {
	preload: function () {
        this.game.load.image('ok', 'img/ok.png', 8, 8);
	},

	create: function () {
        this.game.state.start('Game');
	}
};

})(this);
