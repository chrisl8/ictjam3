(function (scope) {
    "use strict";

    var ICTJAM3 = scope.ICTJAM3;
    var Phaser = scope.Phaser;

    ICTJAM3.Game = function (game) {
        this.stateSave = new ICTJAM3.StateSaver();

        this.mapLoader = new ICTJAM3.MapLoader(game.load);
    };

    ICTJAM3.Game.prototype = {
        create: function () {
            var facing = 'left';
            var cursors;
            this.npc = [];
            this.style = { font: "20px Arial", fill: "#ff0044", align: "center"  };

            this.sprite = this.add.sprite(this.world.centerX, this.world.centerY, 'ok');
            this.sprite.depthVal = 2;

            this.sprite.chatBuddy = this.npc[0] = new ICTJAM3.Npc('ok', "I should find someone to talk to", 500000, 500000, this);
            this.npc['mom'] = new ICTJAM3.Npc('mom', "Lucy, than goodness you are ok!", 50, 50, this);
            this.npc['mom'].depthVal = 2;

            this.sprite.anchor.setTo(0.5, 0.5);

            this.physics.startSystem(Phaser.Physics.ARCADE);

            if (!this.stateSave.get('currentMap')) {
                this.stateSave.set('currentMap', {x: 0, y: 0});
            }
            var curWorldCoords = this.stateSave.get('currentMap');
            this.mapLoader.loadMapAtCoord(curWorldCoords.x, curWorldCoords.y, function (mapName) {
                this.initializeMap(mapName);
            }, this);

            this.time.desiredFps = 30;

            this.physics.enable(this.sprite, Phaser.Physics.ARCADE);
            this.physics.enable(this.npc['mom'].body, Phaser.Physics.ARCADE);

            this.sprite.body.setSize(20, 32, 5, 16);
            this.sprite.body.drag.setTo(1000, 1000);

            this.cursors = this.input.keyboard.createCursorKeys();
            this.button = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.world.sort('depthVal');
            this.paused = false;
            this.button.onDown.add(function () {
                this.sprite.chatBuddy.talk();
            }, this);
        },

        update: function () {
            this.sprite.angle++;

            if (this.paused) {
                return;
            }

            this.sprite.body.velocity.x = 0;

            this.physics.arcade.collide(this.sprite, this.npc['mom'].body, function (a, b) {a.chatBuddy = b.super; console.log('collide')});

            if (this.cursors.left.isDown)
            {
                this.sprite.body.velocity.x = -150;
                if (this.facing != 'left')
                {
                    this.sprite.animations.play('left');
                    this.facing = 'left';
                }
            }
            else if (this.cursors.right.isDown)
            {
                this.sprite.body.velocity.x = 150;
                if (this.facing != 'right')
                {
                    this.sprite.animations.play('right');
                    this.facing = 'right';
                }
            }
            if (this.cursors.up.isDown)
            {
                this.sprite.body.velocity.y = -150;
                if (this.facing != 'left')
                {
                    this.sprite.animations.play('left');
                    this.facing = 'left';
                }
            }
            if (this.cursors.down.isDown)
            {
                this.sprite.body.velocity.y = 150;
                if (this.facing != 'right')
                {
                    this.sprite.animations.play('right');
                    this.facing = 'right';
                }
            }
            if(this.button.isDown) {
            }
            if (this.facing != 'idle')
            {
                this.sprite.animations.stop();
                if (this.facing == 'left')
                {
                    this.sprite.frame = 0;
                }
                else
                {
                    this.sprite.frame = 5;
                }
                this.facing = 'idle';
            }

            var curWorldCoords = this.stateSave.get('currentMap');
            if (this.sprite.x + 10 > this.world.width) {
                this.paused = true;
                curWorldCoords.x += 1;
                this.mapLoader.loadMapAtCoord(curWorldCoords.x, curWorldCoords.y, function (mapName) {
                    this.initializeMap(mapName, {xDir: 1, yDir: 0});
                }, this);
            }
            if (this.sprite.x - 10 < 0) {
                this.paused = true;
                curWorldCoords.x -= 1;
                this.mapLoader.loadMapAtCoord(curWorldCoords.x, curWorldCoords.y, function (mapName) {
                    this.initializeMap(mapName, {xDir: -1, yDir: 0});
                }, this);
            }
            if (this.sprite.y + 10 > this.world.height) {
                this.paused = true;
                curWorldCoords.y += 1;
                this.mapLoader.loadMapAtCoord(curWorldCoords.x, curWorldCoords.y, function (mapName) {
                    this.initializeMap(mapName, {xDir: 0, yDir: 1});
                }, this);
            }
            if (this.sprite.y - 10 < 0) {
                this.paused = true;
                curWorldCoords.y -= 1;
                this.mapLoader.loadMapAtCoord(curWorldCoords.x, curWorldCoords.y, function (mapName) {
                    this.initializeMap(mapName, {xDir: 0, yDir: -1});
                }, this);
            }
        },

        initializeMap: function (key, slide) {
            if (this.map) {
                this.prevMap = this.map;
                this.prevMapLayer = this.mapLayer;
            }
            this.map = this.add.tilemap('map_' + key);
            this.map.addTilesetImage('temp_tiles', 'temp_tiles');

            this.mapLayer = this.map.createLayer('Tile Layer 1');
            this.world.sendToBack(this.mapLayer);
            this.mapLayer.depthVal = 1;

            this.world.sort('depthVal');

            if (slide) {
                this.mapLayer.cameraOffset.x = this.world.width * slide.xDir;
                this.mapLayer.cameraOffset.y = this.world.height * slide.yDir;

                var targetX = (slide.xDir === 0) ? this.sprite.x : ((slide.xDir === 1) ? 18 : this.world.width - 18);
                var targetY = (slide.yDir === 0) ? this.sprite.y : ((slide.yDir === 1) ? 18 : this.world.height - 18);
                var t1 = this.add.tween(this.mapLayer.cameraOffset).to({x: 0, y:0}, 400, Phaser.Easing.Circular.InOut);
                var t2 = this.add.tween(this.prevMapLayer.cameraOffset).to({x: (-1 * slide.xDir) * this.world.width, y: (-1 * slide.yDir) * this.world.height}, 400, Phaser.Easing.Circular.InOut);
                var t3 = this.add.tween(this.sprite).to({x: targetX, y: targetY}, 400, Phaser.Easing.Exponential.InOut);
                t2.onComplete.add(function () {
                    this.paused = false;
                    this.removeOldMap();
                }, this);

                t1.start();
                t2.start();
                t3.start();
            } else {
                this.removeOldMap();
            }
        },

        removeOldMap: function () {
            if (this.prevMap) {
                this.prevMapLayer.destroy();
                this.prevMap.destroy();
            }
        }
    };

})(this);
