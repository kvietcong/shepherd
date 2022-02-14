class Obstacle extends Entity {
    constructor(x, y, src, boxX = 96, boxY = 96, frameX = 43, frameY = 38, scale = 2){
        super(x, y, boxX, boxY);

        this.src = src;

        // Attaching default animator
        if (src) {
            let obstacle = assetManager.getAsset(this.src);
            const obAnimations = { only: { frameAmount: 1, startX: 0, startY: 0} };
            let obAnim = new Animator(obstacle, "only", obAnimations, frameX, frameY, 1/30, scale);
            this.setAnimator(obAnim);
        }
    }

    update(gameEngine){
        super.update(gameEngine);
    }

    draw(ctx, gameEngine){
        super.draw(ctx, gameEngine);
        
    }
}