class Obstacle extends Entity {
    constructor(x, y, src, srtX = 0, srtY = 0, sizeX = 43, sizeY = 38, scale = 2, boxX = 96, boxY = 96){
        super(x, y, sizeX*scale, sizeY*scale);

        this.src = src;
        this.srtX = srtX;
        this.srtY = srtY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.scale = scale;

        // Attaching default animator
        if (src) {
            let obstacle = assetManager.getAsset(this.src);
            const obAnimations = { only: { frameAmount: 1, startX: this.srtX, startY: this.srtY} };
            let obAnim = new Animator(obstacle, "only", obAnimations, this.sizeX, this.sizeY, 1/30, this.scale);
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

class Barn extends Obstacle {

    constructor(x, y) {
        super(x, y, 100, 100);
    }

    update(gameEngine){
        super.update(gameEngine);
    }
}

class Fire extends Obstacle {

    constructor(x, y) {
        super(x, y, 100, 100);
    }

    update(gameEngine){
        super.update(gameEngine);
    }
}