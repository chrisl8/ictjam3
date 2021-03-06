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
            var cursors;
            this.npc = [];
            this.style = { font: "20px Arial", fill: "#ff0044", align: "center"  };

            this.sprite = new ICTJAM3.Npc('lucy', this.world.centerX - 250, this.world.centerY, this);
            delete this.sprite.check;
            this.sprite.isPlayer = true;
            this.world.add(this.sprite);
            this.sprite.superspeed = 1;
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

            this.currentDialogBox = false;
            this.chatTarget = null;
            this.button.onDown.add(function () {
                this.attemptChat();
            }, this);

            this.TurboButton = this.input.keyboard.addKey(Phaser.Keyboard.S);
            this.TurboButton.onDown.add(function () {
                this.sprite.superspeed += 1;
                if (this.sprite.superspeed > 6) {
                    this.sprite.superspeed = 1;
                }
            }, this);

            this.TurboButton = this.input.keyboard.addKey(Phaser.Keyboard.D);
            this.TurboButton.onDown.add(function () {
                this.sprite.superspeed = 1;
            }, this);

            this.movementEnabled = true;

            this.entities = this.add.group();
            this.entities.depthVal = 2;

            // Set conditions
            this.stateSave.set('mom', 0);
            this.stateSave.set('dad', 0);
            this.stateSave.set('pa', 0);
            this.stateSave.set('lucy', 0);
            this.stateSave.set('npc1', 0);
            this.stateSave.set('npc2', 0);
            this.stateSave.set('npc3', 0);
            this.stateSave.set('npc4', 0);
            this.stateSave.set('npc5', 0);
            this.stateSave.set('shaman', 0);
            this.sprite.body.immovable = false;
            this.stateSave.set('dragon', 0);
            this.stateSave.set('pendant', 0);
            this.stateSave.set('end', 0);

        },

        attemptChat: function () {
            if (this.currentDialogBox !== false) {
                this.chatTarget.hideText();
                if (this.currentDialogBox.hasOwnProperty('talkNext') || this.currentDialogBox.talkNext === null) {
                    this.chatTarget = this.findEntity(this.currentDialogBox.talkNext);
                    if (this.chatTarget !== false) {
                        this.doChat();
                    } else {
                        this.leaveChat();
                    }
                } else {
                    this.leaveChat();
                }
            } else {
                var targetEnt = this.findCloseNPC();
                if (targetEnt) {
                    this.chatTarget = targetEnt;
                    this.doChat();
                }
            }
        },

        leaveChat: function () {
            this.movementEnabled = true;
            if (this.chatTarget) {
                this.chatTarget.hideText();
            }
            this.currentDialogBox = false;
            this.chatTarget = false;

            var e = this.stateSave.get('pendant');
            if (e === 6) {
                console.log('showing end');
                this.showEndSplash();
            }
        },

        doChat: function () {
            this.chatTarget.talk();
            if ((!this.currentDialogBox.hasOwnProperty('text') || this.currentDialogBox.text === null) && this.currentDialogBox.hasOwnProperty('talkNext')) {
                this.attemptChat();
            }
        },

        showEndSplash: function () {
            this.endSplash = this.add.sprite(0, 0, 'end');
            this.endSplash.alpha = 0;
            this.endSplash.depthVal = 10;
            var tw = this.add.tween(this.endSplash).to({alpha: 1}, 2400);
            tw.start();
        },

        update: function () {
            //this.game.debug.spriteInfo(this.sprite, 32, 32);
            if (this.paused) {
                return;
            }
            for (var i = 0, len = this.entities.length; i < len; i++) {
                if(this.entities.children[i].check){
                    this.entities.children[i].check();
                }
            }




            this.sprite.body.velocity.x = 0;

            this.physics.arcade.collide(this.sprite, this.entities, function (a, b) {a.chatBuddy = b;});

            this.physics.arcade.collide(this.sprite, this.mapLayer);


            if (this.movementEnabled) {
                if (this.cursors.left.isDown)
                {
                    this.sprite.scale.setTo(-1, 1);
                    this.sprite.animations.play('walkSideways');
                    this.sprite.body.velocity.x = -150 * this.sprite.superspeed;
                    if (this.sprite.facing !== 'left')
                    {
                        this.sprite.facing = 'left';
                    }
                }
                else if (this.cursors.right.isDown)
                {
                    this.sprite.scale.setTo(1, 1);
                    this.sprite.animations.play('walkSideways');
                    this.sprite.body.velocity.x = 150 * this.sprite.superspeed;
                    if (this.sprite.facing !== 'right')
                    {
                        this.sprite.facing = 'right';
                    }
                }
                if (this.cursors.up.isDown)
                {
                    this.sprite.scale.setTo(1, 1);
                    this.sprite.animations.play('walkUp');
                    this.sprite.body.velocity.y = -150 * this.sprite.superspeed;
                    if (this.sprite.facing !== 'up')
                    {
                        this.sprite.facing = 'up';
                    }
                }
                else if (this.cursors.down.isDown)
                {
                    this.sprite.scale.setTo(1, 1);
                    this.sprite.animations.play('walkDown');
                    this.sprite.body.velocity.y = 150 * this.sprite.superspeed;
                    if (this.sprite.facing !== 'down')
                    {
                        this.sprite.facing = 'down';
                    }
                }
            } else {
                // Because this bug is fun.
                if (this.cursors.right.isDown) {
                    this.sprite.scale.setTo(1, 1);
                } else if (this.cursors.left.isDown) {
                    this.sprite.scale.setTo(-1, 1);
                }
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

            this.entities.sort('y', Phaser.Group.SORT_ASCENDING);
        },

        initializeMap: function (key, slide) {
            if (this.map) {
                this.prevMap = this.map;
                this.prevMapLayerGroup = this.mapLayerGroup;
                this.prevMapLayer = this.mapLayer;
            }
            this.entities.removeChild(this.sprite);
            this.world.add(this.sprite);
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
            this.map.setCollisionByIndex(8, false);
            this.map.setCollisionBetween(22, 24, false);
            this.map.setCollisionBetween(28, 30, false);
            this.map.setCollisionByIndex(32, false);
            this.map.setCollisionBetween(36, 40, false);

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

                    this.world.removeChild(this.sprite);
                    this.entities.add(this.sprite);
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
            var spr = new Phaser.Sprite(this.game, data.x, data.y, data.name);
            spr.anchor.setTo(0.5, 0.5);
            return spr;
        },

        createMapEntities: function () {
            if (!this.map.objects.hasOwnProperty('entities')) {

                return;
            }
            var entities = this.map.objects.entities;
            console.log(entities);

            entities.forEach(function (ent) {
                var conditionData = ent.properties;
                if (typeof conditionData === 'undefined' || !conditionData) {
                    var entSprite = this.newEntity(ent);
                entSprite.name = ent.name;
                this.entities.add(entSprite);
                return;
                }
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
                entSprite.name = ent.name;
                if (conditionData.hasOwnProperty('overlap')) {
                    if (conditionData.overlap === 'pickup') {
                        entSprite.pickuper = this.sprite;
                        if (conditionData.hasOwnProperty('pickupVar')) {
                            entSprite.stateSave = this.stateSave;
                            entSprite.pickupVar = conditionData.pickupVar;
                        }
                        entSprite.update = function () {
                            if (this.alive !== true) {
                                return;
                            }
                            var pickuperPos = new Phaser.Point(this.pickuper.x, this.pickuper.y + 8);
                            if (pickuperPos.distance(this) < 10) {
                                console.log('got me');
                                this.kill();
                                if (this.hasOwnProperty('pickupVar')) {
                                    var val = this.stateSave.get(this.pickupVar);
                                    if (typeof val !== "number") {
                                        val = 0;
                                    }
                                    this.stateSave.set(this.pickupVar, val + 1);
                                }
                            }
                        };
                    }
                }
                this.entities.add(entSprite);
            }, this);
        },

        findEntity: function (name) {
            if (name === 'lucy') {
                return this.sprite;
            }
            var filtered = this.entities.children.filter(function (e) {
                return e.name === name;
            });
            if (filtered.length < 1) {
                return false;
            }
            return filtered[0];
        },

        findCloseNPC: function () {
            var playerTalkPos = new Phaser.Point(this.sprite.position.x, this.sprite.position.y);
            if (this.sprite.facing === 'left') {
                playerTalkPos.x -= 32;
            } else if (this.sprite.facing === 'right') {
                playerTalkPos.x += 32;
            } else if (this.sprite.facing === 'up') {
                playerTalkPos.y -= 32;
            } else if (this.sprite.facing === 'down') {
                playerTalkPos.y += 32;
            }

            var filtered = this.entities.children.filter(function (e) {
                if (e.isPlayer) {
                    return false;
                }
                return playerTalkPos.distance(e) < 24;
            });
            if (filtered.length < 1) {
                return false;
            }
            return filtered[0];
        }
    };

})(this);
