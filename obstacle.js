class Obstacle extends Entity {
    /**
     * @param {Number} x Position to draw object on the x axis
     * @param {Number} y Position to draw object on the y axis
     * @param {Image} src image object to draw from
     * @param {Number} startX x origin on the source image
     * @param {Number} startY y origin on the source image
     * @param {Number} sizeX x size to draw from the source image
     * @param {Number} sizeY y size to draw from the source image
     * @param {Number} scale size to draw in the game world
     * @param {Boolean} dFlag True for destructable object, False for indestrucable objects
     * @param {Number} collisionW x size to make the collision box
     * @param {Number} collisionH y size to make the collision box
     */
    constructor(x, y, src, startX, startY, sizeX, sizeY, scale, dFlag, collisionW, collisionH) {
        const collisionWidth = collisionW || (sizeX * scale);
        const collisionHeight = collisionH || (sizeY * scale);
        
        super(x, y, collisionWidth, collisionHeight);
        this.dFlag = dFlag;
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