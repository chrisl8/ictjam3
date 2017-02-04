(function (scope) {
"use strict";

var ICTJAM3 = scope.ICTJAM3;
var Phaser = scope.Phaser;

ICTJAM3.Boot = function () {
    "use strict";

};

ICTJAM3.INITIAL_SCALE = 2;

ICTJAM3.Boot.prototype = {
	create: function () {
        "use strict";
		this.game.input.maxPointers = 1;

		this.game.stage.disableVisibilityChange = true;

	    if (this.game.device.desktop) {
		    this.game.stage.scale.pageAlignHorizontally = true;
	    } else {
		    this.game.stage.scale.pageAlignHorizontally = true;
	    }
        this.game.state.add('Preloader', ICTJAM3.Preloader);
        this.game.state.add('Game', ICTJAM3.Game);

        this.game.stage.backgroundColor = '#140c1c';

        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.myScaleFactor = ICTJAM3.INITIAL_SCALE;
        this.game.scale.setUserScale(ICTJAM3.INITIAL_SCALE, ICTJAM3.INITIAL_SCALE);

        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        this.game.renderer.renderSession.roundPixels = true;


		this.game.state.start('Preloader');
	}
};

})(this);
