(function (scope) {
    "use strict";

    var ICTJAM3 = scope.ICTJAM3;
    var Phaser = scope.Phaser;

    ICTJAM3.Npc = function (name, x, y, game) {
        Phaser.Sprite.call(this, game.game, x, y, name, 0);
        this.anchor.setTo(0.5, 0.5);

        game.physics.arcade.enable(this);
        this.body.immovable = true;
        this.gam = game;

        this.body.setSize(20, 20, 10, 16);
        this.body.drag.setTo(1000, 1000);

        this.oneSecond = false;
        //this.game = this;
        this.text = null;
        this.timeout = null;
        this.hideText = function(){
            if(this.text) {
                this.text.kill();
                clearTimeout(this.timeout);
            }
        };
        this.exit = function(){
            var tweenA = this.gam.add.tween(this).to( { x: 2000, y: 2000  }, 1000, "Quart.easeOut" );
            tweenA.start();
        }
        this.arrive = function(){
            var x = (100 * Math.random() + 250);
            var y = (100 * Math.random() + 250);
            var tweenA = this.gam.add.tween(this).to( { x: 250, y: 200  }, 1000, "Quart.easeOut" );
            tweenA.start();
        }
        this.movex = function(x, old){
            var tweenA = this.gam.add.tween(this).to( { x: old + x }, 1000, "Quart.easeOut" );
            tweenA.start();
        }
        this.movey = function(y, old){
            var tweenA = this.gam.add.tween(this).to( { y: old + y }, 1000, "Quart.easeOut" );
            tweenA.start();
        }

        this.check = function() {
            var characterTextOptions = game.cache.getJSON('ictGameJamScript')[name];
            var dialogObj = false;
            for (var i = 0; i < characterTextOptions.length; i++) {
                if (!characterTextOptions[i].hasOwnProperty('action')) {
                    continue;
                }
                if (characterTextOptions[i].hasOwnProperty('condition')) {
                    var saveStateValue = game.stateSave.get(characterTextOptions[i].condition);
                    if (typeof saveStateValue === 'undefined' || saveStateValue === null) {
                        break;
                    }
                    if (characterTextOptions[i].condType === 'greaterEqual') {
                        if (saveStateValue >= Number(characterTextOptions[i].condValue)) {
                            dialogObj = characterTextOptions[i];
                            break;
                        }
                    } else if (characterTextOptions[i].condType === 'lessEqual') {
                        if (saveStateValue <= Number(characterTextOptions[i].condValue)) {
                            dialogObj = characterTextOptions[i];
                            break;
                        }
                    } else if (characterTextOptions[i].condType === 'equal') {
                        if (saveStateValue === Number(characterTextOptions[i].condValue)) {
                            dialogObj = characterTextOptions[i];
                            break;
                        }
                    }
                }
            }
            if (dialogObj) {
                if(dialogObj == "exit") this.exit();
                else if(dialogObj.action == "exit") this.exit();
                else if(dialogObj.action == "arrive") this.arrive();
                else if(dialogObj.action == "moveright") this.movex(100, this.x);
                else if(dialogObj.action == "moveleft") this.movex(-100, this.x);
                else if(dialogObj.action == "moveup") this.movey(-150, this.y);
                else if(dialogObj.action == "movedown") this.movey(150, this.y);
//                else eval(dialogObj);
            }
            if (dialogObj.hasOwnProperty('advances')) {
                var val = game.stateSave.get(dialogObj.advances);
                if (typeof val === 'number') {
                    game.stateSave.set(dialogObj.advances, val + 1);
                }
            }
        };







        this.talk = function() {
            this.hideText();
            var characterTextOptions = game.cache.getJSON('ictGameJamScript')[name];
            var dialogObj = false;
            for (var i = 0; i < characterTextOptions.length; i++) {
                if (characterTextOptions[i].hasOwnProperty('action')) {
                    continue;
                }
                if (characterTextOptions[i].hasOwnProperty('condition')) {
                    var saveStateValue = game.stateSave.get(characterTextOptions[i].condition);
                    console.log(this.name, ": ", saveStateValue, characterTextOptions[i].condition, characterTextOptions[i].condType, characterTextOptions[i].condValue);
                    if (typeof saveStateValue === 'undefined' || saveStateValue === null) {
                        break;
                    }
                    var cval = characterTextOptions[i].condValue;
                    if (!isNaN(parseInt(cval))) {
                        cval = parseInt(cval);
                        console.log(cval);
                    }
                    if (characterTextOptions[i].condType === 'greaterEqual') {
                        if (saveStateValue >= cval) {
                            dialogObj = characterTextOptions[i];
                            break;
                        }
                    } else if (characterTextOptions[i].condType === 'lessEqual') {
                        if (saveStateValue <= cval) {
                            dialogObj = characterTextOptions[i];
                            break;
                        }
                    } else if (characterTextOptions[i].condType === 'equal') {
                        if (saveStateValue === cval) {
                            dialogObj = characterTextOptions[i];
                            break;
                        }
                    }
                }
            }
            console.log(dialogObj);
            if (dialogObj) {
                game.currentDialogBox = dialogObj;
                game.movementEnabled = false;
            }
            if (dialogObj.hasOwnProperty('advances')) {

                var val = game.stateSave.get(dialogObj.advances);
                if (typeof val === 'number') {
                    game.stateSave.set(dialogObj.advances, val + 1);
                }
            }
            console.log(game.stateSave.get("pendant"));
            if (dialogObj.text) {
                this.text = this.addChild(new ICTJAM3.SpeechBubble(game, 10, 0, 256, dialogObj.text));
            }
        };
    };

    ICTJAM3.Npc.prototype = Object.create(Phaser.Sprite.prototype);
    ICTJAM3.Npc.prototype.constructor = ICTJAM3.Npc;
})(this);
