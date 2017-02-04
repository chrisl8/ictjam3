(function (scope) {
    "use strict";
    // From: http://jsfiddle.net/lewster32/81pzgs4z/

    var ICTJAM3 = scope.ICTJAM3;
    var Phaser = scope.Phaser;

    ICTJAM3.SpeechBubble = function (game, x, y, width, text) {
        console.log(game);
        Phaser.Sprite.call(this, game, x, y);
        console.log(this);

        // Some sensible minimum defaults
        width = width || 27;
        var height = 18;

        // Set up our text and run our custom wrapping routine on it
        this.bitmapText = this.game.make.bitmapText(x + 12, y + 4, '8bitoperator', text, 22);
        ICTJAM3.SpeechBubble.wrapBitmapText(this.bitmapText, width);

        // Calculate the width and height needed for the edges
        var bounds = this.bitmapText.getLocalBounds();
        if (bounds.width + 18 > width) {
            width = bounds.width + 18;
        }
        if (bounds.height + 14 > height) {
            height = bounds.height + 14;
        }

        // Create all of our corners and edges
        this.borders = [
            this.game.make.tileSprite(x + 9, y + 9, width - 9, height - 9, 'bubble-border', 4),
            this.game.make.image(x, y, 'bubble-border', 0),
            this.game.make.image(x + width, y, 'bubble-border', 2),
            this.game.make.image(x + width, y + height, 'bubble-border', 8),
            this.game.make.image(x, y + height, 'bubble-border', 6),
            this.game.make.tileSprite(x + 9, y, width - 9, 9, 'bubble-border', 1),
            this.game.make.tileSprite(x + 9, y + height, width - 9, 9, 'bubble-border', 7),
            this.game.make.tileSprite(x, y + 9, 9, height - 9, 'bubble-border', 3),
            this.game.make.tileSprite(x + width, y + 9, 9, height - 9, 'bubble-border', 5)
        ];

        // Add all of the above to this sprite
        for (var b = 0, len = this.borders.length; b < len; b++) {
            this.addChild(this.borders[b]);
        }

        // Add the tail
        this.tail = this.addChild(this.game.make.image(x + 18, y + 3 + height, 'bubble-tail'));

        // Add our text last so it's on top
        this.addChild(this.bitmapText);
        this.bitmapText.tint = 0x111111;

        // Offset the position to be centered on the end of the tail
        this.pivot.set(x + 25, y + height + 24);
    };

    ICTJAM3.SpeechBubble.prototype = Object.create(Phaser.Sprite.prototype);
    ICTJAM3.SpeechBubble.prototype.constructor = ICTJAM3.SpeechBubble;

    ICTJAM3.SpeechBubble.wrapBitmapText = function (bitmapText, maxWidth) {
        var words = bitmapText.text.split(' '), output = "", test = "";

        for (var w = 0, len = words.length; w < len; w++) {
            test += words[w] + " ";
            bitmapText.text = test;
            bitmapText.updateText();
            if (bitmapText.textWidth > maxWidth) {
                output += "\n" + words[w] + " ";
            }
            else {
                output += words[w] + " ";
            }
            test = output;
        }

        output = output.replace(/(\s)$/gm, ""); // remove trailing spaces
        bitmapText.text = output;
        bitmapText.updateText();
    }

})
(this);
