class Obstacle extends Entity {
    constructor(x, y, src, startX, startY, sizeX, sizeY, scale, collisionW, collisionH) {
        const collisionWidth = collisionW || (sizeX * scale);
        const collisionHeight = collisionH || (sizeY * scale);
        super(x, y, collisionWidth, collisionHeight);
        if (src) {
            const obstacle = assetManager.getAsset(src);
            const pixelWidth = sizeX * scale;
            const pixelHeight = sizeY * scale;
            const drawX = this.xCenter - (pixelWidth / 2);
            const drawY = y + collisionHeight - pixelHeight;
            this.drawer = (ctx, gameEngine) => {
                ctx.drawImage(obstacle,
                    startX, startY,
                    sizeX, sizeY,
                    drawX, drawY,
                    sizeX * scale, sizeY * scale,
                );
            };
        }
    }

    update(gameEngine){
        super.update(gameEngine);
    }

    draw(ctx, gameEngine){
        super.draw(ctx, gameEngine);
        this.drawer(ctx, gameEngine);
    }
}

class Barn extends Obstacle {

    constructor(x, y, src, startX, startY, sizeX, sizeY, scale, collisionW, collisionH) {
        super(x, y, src, startX, startY, sizeX, sizeY, scale, collisionW, collisionH);
    }

    update(gameEngine){
        super.update(gameEngine);
    }

    draw(ctx, gameEngine){
        super.draw(ctx, gameEngine);
        this.drawer(ctx, gameEngine);
    }
}

const makeCampfireAnimator = () => {
    const size = 64;
    const campfireAnimations = {
        main: {frameAmount: 4, startX: 0, startY: 0},
    };
    return new Animator(
        assetManager.getAsset("./resources/campfire_3.png"),
        "main",
        campfireAnimations,
        size,
        size,
        1/5
    );
};

class Fire extends Obstacle {

    constructor(x, y, src, startX, startY, sizeX, sizeY, scale, collisionW, collisionH) {
        super(x, y, src, startX, startY, sizeX, sizeY, scale, collisionW, collisionH);
        //this.animator = makeCampfireAnimator();
        this.setAnimator(makeCampfireAnimator());
        this.animator.setIsLooping();
        this.animator.play();
    }

    update(gameEngine){
        super.update(gameEngine);
        this.animator.update(gameEngine);
    }

    draw(ctx, gameEngine){
        super.draw(ctx, gameEngine);
        this.drawer(ctx, gameEngine);
    }
}