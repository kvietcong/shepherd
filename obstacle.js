class Obstacle extends Entity {
    constructor(x, y, src, boxX = 96, boxY = 96){
        super(x, y, boxX, boxY);

        this.src = src;

        // Attaching default animator
        if (src) {
            let obstacle = assetManager.getAsset(this.src);
            const obAnimations = { only: { frameAmount: 1, startX: 0, startY: 0} };
            let obAnim = new Animator(obstacle, "only", obAnimations, 43, 38, 1/30, 2);
            this.setAnimator(obAnim);
        }
    }

    update(gameEngine){
        super.update(gameEngine);

        gameEngine.entities.forEach(entity => {
            if (entity === this) return;

            // Avoid Overlap
            if (this.collidesWith(entity)) {
                //console.log("collision detected with obstacle: " + this);
            }
        });
    }

    draw(ctx, gameEngine){
        super.draw(ctx, gameEngine);
    }
}