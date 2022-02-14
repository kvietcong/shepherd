class Obstacle extends Entity {
    constructor(x, y, src, startX, startY, sizeX, sizeY, scale, collisionWidth, collisionHeight) {
        super(x, y, collisionWidth || (sizeX*scale), collisionHeight || (sizeY*scale));

        this.src = src;

        // Attaching default animator
        if (src) {
            let obstacle = assetManager.getAsset(this.src);
            const obAnimations = { only: { frameAmount: 1, startX, startY} };
            let obAnim = new Animator(
                obstacle, "only", obAnimations,
                sizeX, sizeY, 500, scale,
            );
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

class Barn extends Obstacle {

    constructor(x, y) {
        super(x, y, 100, 100);
    }

    update(gameEngine){
        super.update(gameEngine);
    }
}