(function (scope) {
    "use strict";

    var ICTJAM3 = scope.ICTJAM3;
    var Phaser = scope.Phaser;

    ICTJAM3.Npc = function (name, x, y, game) {
        Phaser.Sprite.call(this, game.game, x, y, name, 0);
        this.anchor.setTo(0.5, 0.5);

        game.physics.arcade.enable(this);
        this.body.immovable = true;

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
            this.x = 2000;
            this.y = 2000;
        }
        this.arrive = function(){
            console.log('arrive');
            this.x = 250;
            this.y = 200;
        }
        this.movex = function(x){
            this.x = this.x + x;
        }
        this.movey = function(y){
            this.y = this.y + y;
        }
        this.check = function(){
            var characterTextOptions = game.cache.getJSON('ictGameJamScript')[name];

            var textToSay = false;

            for (var i = 0; i < characterTextOptions.length; i++) {
                if (characterTextOptions[i].hasOwnProperty('action')) {

                    if (characterTextOptions[i].hasOwnProperty('condition')) {
                        var saveStateValue = game.stateSave.get(characterTextOptions[i].condition);
                        if (typeof saveStateValue === 'undefined' || saveStateValue === null) {
                            continue;
                        }
                        if (characterTextOptions[i].condType === 'greaterEqual') {
                            if (saveStateValue < characterTextOptions[i].condVal) {
                                textToSay = characterTextOptions[i].action;
                                continue;
                            }
                        } else if (characterTextOptions[i].condType === 'equal') {
                            if (saveStateValue !== characterTextOptions[i].condVal) {
                                textToSay = characterTextOptions[i].action;
                                continue;
                            }
                        }
                    }
                }
            }
            if (textToSay) {
                if(textToSay == "exit") this.exit();
                else if(textToSay == "exit") this.exit();
                else if(textToSay == "arrive") this.arrive();
                else if(textToSay == "moveright") this.movex(100);
                else if(textToSay == "moveleft") this.movex(-100);
                else if(textToSay == "moveup") this.movey(-100);
                else if(textToSay == "movedown") this.movey(100);
//                else eval(textToSay);
            }
        }

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
            if (dialogObj.text) {
                console.log('doing text');
                this.text = this.addChild(new ICTJAM3.SpeechBubble(game, 10, 0, 256, dialogObj.text));
            }
        };
    };

    ICTJAM3.Npc.prototype = Object.create(Phaser.Sprite.prototype);
    ICTJAM3.Npc.prototype.constructor = ICTJAM3.Npc;
})(this);
