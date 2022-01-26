// Quick Docs (Going to function has more details [maybe])
// - play()
// - pause()
// - stop() - Go to beginning of the animation and pause
// - reset() - Go to beginning of the animation
// - restart() - Go to beginning of the animation and play
// - reverse() - Reverse the animation (Play backwards)
// - flipX() - Flip sprite on the X axis
// - flipY() - Flip sprite on the Y axis
// - setAnimation(<Key (String)>)) - Set the animation to the given key
// - getDrawFunction() - Returns the function that draws the sprite
//   (Call this in entity's draw function and call the function returned from it)
// - update(<GameEngine Instance>) - Move animation forward
//   (Call this in entity's update function)

class Animator {
    /**
     * Construct a new Animator instance.
     * @param {Image} spriteSheet Image containing all the frames
     * @param {String} currentAnimationKey Key for the current animation
     * @param {Object} animationInfo Animation Info for all animations
     *     Every entry in animationInfo should contain the following keys:
     *     - frameAmount {Number}: Amount of frames in the animation
     *     - startX {Number}: Starting X pixel position of the animation
     *     - startY {Number}: Starting Y pixel position of the animation
     * @param {Number} frameWidth Width of each frame in pixels
     * @param {Number} frameHeight Height of each frame in pixels
     * @param {Number} [frameDuration=1/30] How many seconds each frame lasts
     * @param {Number} [scale=1] How much to scale the animation by
     * @param {Boolean} [isHorizontal=true] If the spritesheet frames go
     *  horizontal or vertical
     * @param {Boolean} [isImageSmoothingEnabled=true] If image smoothing should
     * be enabled
     *
     * @returns {Animator} New Animator object
     */
    constructor(
        spriteSheet,
        currentAnimationKey,
        animationInfo,
        frameWidth, frameHeight,
        frameDuration = 1/30,
        scale = 1,
        isHorizontal = true,
        isImageSmoothingEnabled = false,
    ) {
        this.scale = scale;
        this.spriteSheet = spriteSheet;
        this.isHorizontal = isHorizontal;
        this.isImageSmoothingEnabled = isImageSmoothingEnabled;

        this.checkAnimations(animationInfo);
        if (!(currentAnimationKey in animationInfo))
            throw new Error("Animation does not exist");

        this.animationInfo = animationInfo;
        this.currentAnimationKey = currentAnimationKey;
        this.currentAnimationInfo = animationInfo[currentAnimationKey];

        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        this.frameX = this.currentAnimationInfo.startX;
        this.frameY = this.currentAnimationInfo.startY;

        this.frameDuration = frameDuration;
        this.timeSinceLastFrameChange = 0;

        this.isPlaying = false;
        this.isReverse = false;
        this.isLooping = true;
        this.willFlipX = false;
        this.willFlipY = false;

        // For drawing animator directly to the canvas (Not recommended)
        this.x = 0;
        this.y = 0;
    }

    /**
     * Throws an error if the given animationInfo is not valid
     * Animation info should contain at least the following keys:
     * - frameAmount {Number}: Amount of frames in the animation
     * - startX {Number}: Starting X pixel position of the animation
     * - startY {Number}: Starting Y pixel position of the animation
     * @param {Object} animationInfo Object with all the animation information
     */
    checkAnimations(animationInfo) {
        const requiredFields = [ "frameAmount", "startX", "startY" ];
        Object.values(animationInfo).forEach(info => {
            requiredFields.forEach(field => {
                if (!(field in info))
                    throw new Error(`${field} is required for the animation`);
            });
        });
    }

    update(gameEngine) {
        if (!this.isPlaying) return;

        this.timeSinceLastFrameChange += gameEngine.deltaTime;

        // Frame Change Logic
        if (this.timeSinceLastFrameChange >= this.frameDuration) {
            const mainDirection = this.isHorizontal ? "frameX" : "frameY";
            const pixelChange = this.isHorizontal ?
                this.frameWidth : this.frameHeight;
            const mainInitialPosition = this.currentAnimationInfo[
                (this.isHorizontal ? "startX" : "startY")];
            const newPosition = this[mainDirection]
                + (this.isReverse ? -1 : 1) * pixelChange;

            let isDone = this.isReverse ?
                (newPosition < 0)
                :
                (newPosition - mainInitialPosition
                    >= this.currentAnimationInfo.frameAmount * pixelChange
                );

            if (isDone) {
                if (this.isLooping) {
                    this[mainDirection] = mainInitialPosition
                        + this.isReverse * pixelChange
                            * (this.currentAnimationInfo.frameAmount - 1);
                } else {
                    this.pause();
                }
            } else {
                this[mainDirection] +=
                    this.isReverse ? -pixelChange : pixelChange;
            }
            this.timeSinceLastFrameChange = 0;
        }
    }

    /**
     * Switches animation to the given animation corresponding to the key
     * @param {String} animationKey Key for animation corresponding to the
     *  animations Object.
     */
    setAnimation(animationKey) {
        if (!(animationKey in this.animationInfo))
            throw new Error("Animation does not exist");
        if (this.currentAnimationKey === animationKey) return;
        this.currentAnimationKey = animationKey;
        this.currentAnimationInfo = this.animationInfo[animationKey];
        this.reset();
    }

    setIsLooping(isLooping = true) { this.isLooping = isLooping; }
    reverse() { this.isReverse = !this.isReverse; }
    setIsReverse(isReverse = true) { this.isReverse = isReverse; }
    setFrameDuration(frameDuration) { this.frameDuration = frameDuration; }

    flipX() { this.willFlipX = !this.willFlipX; }
    flipY() { this.willFlipY = !this.willFlipY; }
    setWillFlipX(willFlipX = false) { this.willFlipX = willFlipX; }
    setWillFlipY(willFlipY = false) { this.willFlipY = willFlipY; }

    play() { this.isPlaying = true; }
    pause() { this.isPlaying = false; }
    stop() { this.reset(); this.pause(); }
    restart() { this.reset(); this.play(); }

    // Reset the animation to the first frame of the animation and play it
    reset() {
        this.frameX = this.currentAnimationInfo.startX
            + this.isReverse * this.frameWidth *
                (this.currentAnimationInfo.frameAmount - 1) * this.isHorizontal;
        this.frameY = this.currentAnimationInfo.startY
            + this.isReverse * this.frameHeight *
                (this.currentAnimationInfo.frameAmount - 1) * !this.isHorizontal;

        this.timeSinceLastFrameChange = 0;
    }

    serialize() {
        // TODO
    }

    static deserialize() {
        // TODO
    }

    /**
     * Get a function that can draw the animation to the canvas
     * @returns {(CanvasRenderingContext2D, Number, Number, Number) => void}
     *      Function to actually draw the animation frame to the canvas.
     *      This returns a function that you must call!
     */
    getDrawFunction() {
        return (ctx, x, y, rotation = 0) => {
            const pixelWidth = this.frameWidth * this.scale;
            const pixelHeight = this.frameHeight * this.scale;

            ctx.save();
            ctx.imageSmoothingEnabled = this.isImageSmoothingEnabled;
            ctx.translate(
                x - (pixelWidth / 2) - (pixelWidth * this.willFlipX),
                y - (pixelHeight / 2) - (pixelHeight * this.willFlipY)
            );
            ctx.scale(this.willFlipX ? -1 : 1, this.willFlipY ? -1 : 1);

            if (rotation) {
                ctx.translate(pixelWidth / 2, pixelHeight / 2);
                ctx.rotate(rotation * PI / 180);
                ctx.translate(-pixelWidth / 2, -pixelHeight / 2);
            }

            ctx.drawImage(
                this.spriteSheet,
                this.frameX, this.frameY,
                this.frameWidth, this.frameHeight,
                0, 0,
                pixelWidth, pixelHeight
            );
            ctx.restore();
        };
    }

    // Not recommended to use this function. Use getDrawFunction instead
    draw(ctx) { this.getDrawFunction()(ctx, this.x, this.y); }
}