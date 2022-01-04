class Animator {
    constructor(
        spriteSheet,
        frameWidth, frameHeight,
        framePadding,
        frameDuration = 1/30
    ) {
        this.spriteSheet = spriteSheet;

        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.framePadding = framePadding;
        this.frameDuration = frameDuration;

        this.x = 0;
        this.y = 0;

        this.timeSinceLastFrameChange = 0;
        this.isPlaying = false;
        this.isLooping = true;
        this.isReverse = false;
        this.direction = 0;
    }

    update(gameEngine) {
        this.timeSinceLastFrameChange += gameEngine.deltaTime;

        if (this.isPlaying
            && this.timeSinceLastFrameChange >= this.frameDuration
        ) {
            // Frame Change Logic
            if (this.isLooping) { }
            this.timeSinceLastFrameChange = 0;
        }
    }

    setFrame(x, y) { this.x = x; this.y = y; }

    play(direction = 0, isReverse = false) {
        this.isPlaying = true;
        this.direction = direction;
        this.isReverse = isReverse;
    }

    pause() { this.isPlaying = false; }

    stop() { this.pause(); this.x = 0; this.y = 0; }

    setLooping(isLooping = true) { this.isLooping = isLooping; }

    getDrawFunction() {
        const draw = (ctx, x, y) => {
            ctx.drawImage(
                this.spriteSheet,
                this.x * (this.frameWidth + this.framePadding),
                this.y * (this.frameHeight + this.framePadding),
                this.frameWidth + this.framePadding,
                this.frameHeight + this.framePadding,
                x, y,
                this.width * scale,
                this.height * scale
            );
        };

        return draw;
    };
}
