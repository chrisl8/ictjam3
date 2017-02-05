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

            this.sprite = this.add.sprite(this.world.centerX - 250, this.world.centerY, 'lucy', 0);
            this.sprite.depthVal = 2;

            this.sprite.anchor.setTo(0.5, 0.5);

            this.physics.startSystem(Phaser.Physics.ARCADE);

            if (!this.stateSave.get('currentMap')) {
                this.stateSave.set('currentMap', {x: -1, y: 1});
            }
            var curWorldCoords = this.stateSave.get('currentMap');
            this.mapLoader.loadMapAtCoord(curWorldCoords.x, curWorldCoords.y, function (mapName) {
                this.initializeMap(mapName);
            }, this);

            this.time.desiredFps = 30;

            this.physics.enable(this.sprite, Phaser.Physics.ARCADE);


            this.sprite.body.setSize(20, 20, 10, 16);
            this.sprite.body.drag.setTo(1000, 1000);
            this.sprite.animations.add('walkSideways', [4, 5, 3], 9, false);
            this.sprite.animations.add('walkUp', [7, 8, 7], 9, false);
            this.sprite.animations.add('walkDown', [1, 2, 0], 9, false);

            this.cursors = this.input.keyboard.createCursorKeys();
            this.button = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.world.sort('depthVal');
            this.paused = false;
            this.button.onDown.add(function () {
                if (this.sprite.chatBuddy) {
                    this.sprite.chatBuddy.talk();
                }
            }, this);

            this.entities = this.add.group();
            this.entities.depthVal = 2;

            // Test condition for mom
            this.stateSave.set('mom', 0);

        },

        update: function () {
            //this.game.debug.spriteInfo(this.sprite, 32, 32);
            if (this.paused) {
                return;
            }

            this.sprite.body.velocity.x = 0;

            this.physics.arcade.collide(this.sprite, this.entities, function (a, b) {a.chatBuddy = b;});

            this.physics.arcade.collide(this.sprite, this.mapLayer);


            if (this.cursors.left.isDown)
            {
                this.sprite.scale.setTo(-1, 1);
                this.sprite.animations.play('walkSideways');
                this.sprite.body.velocity.x = -150;
                if (this.facing != 'left')
                {
                    this.facing = 'left';
                }
            }
            else if (this.cursors.right.isDown)
            {
                this.sprite.scale.setTo(1, 1);
                this.sprite.animations.play('walkSideways');
                this.sprite.body.velocity.x = 150;
                if (this.facing != 'right')
                {
                    this.facing = 'right';
                }
            }
            if (this.cursors.up.isDown)
            {
                this.sprite.scale.setTo(1, 1);
                this.sprite.animations.play('walkUp');
                this.sprite.body.velocity.y = -150;
                if (this.facing != 'left')
                {
                    this.facing = 'left';
                }
            }
            if (this.cursors.down.isDown)
            {
                this.sprite.scale.setTo(1, 1);
                this.sprite.animations.play('walkDown');
                this.sprite.body.velocity.y = 150;
                if (this.facing != 'right')
                {
                    this.facing = 'right';
                }
            }
            if(this.button.isDown) {
            }
            if (this.facing != 'idle')
            {
                // this.sprite.animations.stop();
                if (this.facing == 'left')
                {
                    // this.sprite.frame = 0;
                }
                else
                {
                    // this.sprite.frame = 5;
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
                this.prevMapLayerGroup = this.mapLayerGroup;
                this.prevMapLayer = this.mapLayer;
            }
            this.prevEntities = this.entities;

            this.map = this.add.tilemap('map_' + key);
            this.map.addTilesetImage('temp_tiles', 'temp_tiles');

            this.entities = this.add.group();
            this.entities.depthVal = 2;
            this.createMapEntities();


            this.mapLayerGroup = this.game.add.group();
            this.mapLayerGroup.fixedToCamera = true;

            this.mapLayer = this.map.createLayer('Tile Layer 1', this.game.width, this.game.height, this.mapLayerGroup);
            if (this.map.getLayerIndex('layer2') !== null) {
                this.map.createLayer('layer2', this.game.width, this.game.height, this.mapLayerGroup);
            }
            this.world.sendToBack(this.mapLayerGroup);
            this.mapLayerGroup.depthVal = 1;

            this.map.setCollisionBetween(3, 100);
            this.map.setCollisionByIndex(5, false);

            this.world.sort('depthVal');

            if (slide) {
                this.sprite.chatBuddy = null;
                this.entities.x = this.world.width * slide.xDir;
                this.entities.y = this.world.height * slide.yDir;
                this.mapLayerGroup.cameraOffset.x = this.world.width * slide.xDir;
                this.mapLayerGroup.cameraOffset.y = this.world.height * slide.yDir;

                var prevMapTargetLoc = {x: (-1 * slide.xDir) * this.world.width, y: (-1 * slide.yDir) * this.world.height};
                var targetX = (slide.xDir === 0) ? this.sprite.x : ((slide.xDir === 1) ? 18 : this.world.width - 18);
                var targetY = (slide.yDir === 0) ? this.sprite.y : ((slide.yDir === 1) ? 18 : this.world.height - 18);

                var t1 = this.add.tween(this.mapLayerGroup.cameraOffset).to({x: 0, y:0}, 400, Phaser.Easing.Circular.InOut);
                var t2 = this.add.tween(this.entities).to({x: 0, y:0}, 400, Phaser.Easing.Circular.InOut);
                var t3 = this.add.tween(this.prevMapLayerGroup.cameraOffset).to(prevMapTargetLoc, 400, Phaser.Easing.Circular.InOut);
                var t4 = this.add.tween(this.prevEntities).to(prevMapTargetLoc, 400, Phaser.Easing.Circular.InOut);
                var t5 = this.add.tween(this.sprite).to({x: targetX, y: targetY}, 400, Phaser.Easing.Circular.InOut);
                t3.onComplete.add(function () {
                    this.paused = false;
                    this.removeOldMap();
                }, this);

                t1.start();
                t2.start();
                t3.start();
                t4.start();
                t5.start();
            } else {
                this.removeOldMap();
            }
        },

        removeOldMap: function () {
            if (this.prevMap) {
                this.prevMapLayerGroup.destroy(true);
                this.prevMap.destroy();
            }
            if (this.prevEntities) {
                this.prevEntities.destroy(true);
            }
        },

        newEntity: function (data) {
            //dummy function
            if (data.type === "NPC") {
                return new ICTJAM3.Npc(data.name, data.x, data.y, this);
            }
            return new Phaser.Sprite(this.game, data.x, data.y, data.name);
        },

        createMapEntities: function () {
            if (!this.map.objects.hasOwnProperty('entities')) {
                return;
            }
            var entities = this.map.objects.entities;

            entities.forEach(function (ent) {
                var conditionData = ent.properties;
                if (conditionData.hasOwnProperty('condition')) {
                    var val = this.stateSave.get(conditionData.condition);
                    if (typeof val === 'undefined' || val === null) {
                        return;
                    }
                    if (conditionData.condType === 'greaterEqual') {
                        if (val < conditionData.condVal) {
                            return;
                        }
                    } else if (conditionData.condType === 'lessEqual') {
                        if (val > conditionData.condVal) {
                            return;
                        }
                    } else if (conditionData.condType === 'equal') {
                        if (val !== conditionData.condVal) {
                            return;
                        }
                    }
                }
                var entSprite = this.newEntity(ent);
                this.entities.add(entSprite);
            }, this);
        }
    };

})(this);
