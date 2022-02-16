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