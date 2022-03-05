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
     * @param {Boolean} isDestructible True for destructable object, False for indestrucable objects
     * @param {Number} collisionW x size to make the collision box
     * @param {Number} collisionH y size to make the collision box
     */
    constructor(x, y, src, startX, startY, sizeX, sizeY, scale, collisionW = null, collisionH = null, isDestructible = false) {
        const collisionWidth = collisionW || (sizeX * scale);
        const collisionHeight = collisionH || (sizeY * scale);

        super(x, y, collisionWidth, collisionHeight);
        this.isDestructible = isDestructible;
        this.healthAPI = new HealthAPI(
            100, 100, 1.5, true, true
        ).attachShortcutsTo(this);
        this.dead = false;
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

    attacked(damage) {
        this.healthAPI.damage(damage);
        if (this.healthAPI.health <= 0) {
            this.dead = true;
        }
    }

    update(gameEngine){
        super.update(gameEngine);
        this.healthAPI.update(gameEngine);
        if (this.dead) this.removeFromWorld = true;
    }

    draw(ctx, gameEngine){
        this.drawer(ctx, gameEngine);
        super.draw(ctx, gameEngine);
        this.healthAPI.draw(
            this.xCenter, this.y - 35,
            75, 10,
            ctx, gameEngine);
    }
}

class Barn extends Obstacle {

    constructor(x, y, src, startX, startY, sizeX, sizeY, scale, minSheep, collisionW, collisionH, isDestructible) {
        super(x, y, src, startX, startY, sizeX, sizeY, scale, isDestructible, collisionW, collisionH);
        this.minSheep = minSheep;
    }

    update(gameEngine){
        super.update(gameEngine);
    }

    draw(ctx, gameEngine){
        super.draw(ctx, gameEngine);
        this.drawer(ctx, gameEngine);
    }
}

Barn.sheepCount = 0;
Barn.sheepRequired = 10;

class Tree extends Obstacle {
    constructor(x, y, src, startX, startY, sizeX, sizeY, scale, collisionW, collisionH) {
        super(x, y, src, startX, startY, sizeX, sizeY, scale, collisionW, collisionH, true);
    }
    update(gameEngine) {
        super.update(gameEngine);
        this.healthAPI.update(gameEngine);
        if (this.dead) {
            this.removeFromWorld = true;
            console.log("tree destroyed: x = " + this.x + " y = " + this.y)
            gameEngine.addEntity(new Log(this.xCenter, this.yCenter));
        }
    }
}

class Chest extends Obstacle {
    constructor(x, y, src, startX, startY, sizeX, sizeY, scale, collisionW, collisionH) {
        super(x, y, src, startX, startY, sizeX, sizeY, scale, collisionW, collisionH);
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

    constructor(x, y) {
        super(Math.floor(x/50)*50, Math.floor(y/50)*50, "./resources/campfire_2.png", 0, 0, 33, 38, 2, 50, 30, true);
        this.setAnimator(makeCampfireAnimator());
        this.animator.setIsLooping();
        this.animator.play();
    }

    update(gameEngine){
        super.update(gameEngine);
        this.animator.update(gameEngine);
        gameEngine.entities.forEach(entity => {
            const distance = this.distanceTo(entity);
            if (!entity.healthAPI
                || entity instanceof Wolf
                || distance > 200) return;
            entity.heal(5 * gameEngine.deltaTime);
        });
    }
}

class Fence extends Obstacle {
    constructor(x, y, facing) {
        if (facing == 0) 
            super(Math.floor((x-25)/55)*55, Math.floor((y-60)/55)*55, 
                "./resources/fence_vertical.png", 0, 0, 20, 63, 1, 15, 50, true);
        if (facing == 1)
            super(Math.floor((x-40)/55)*55, Math.floor((y - 30)/55)*55, 
                "./resources/fence_horizontal.png", 0, 0, 46, 32, 1, 50, 15, true);
        if (facing == 2) 
            super(Math.floor((x - 25)/55)*55, Math.floor((y - 10)/55)*55, 
                "./resources/fence_vertical.png", 0, 0, 20, 63, 1, 15, 50, true);
        if (facing == 3)
            super(Math.floor((x + 10)/55)*55, Math.floor((y - 30)/55)*55, 
                "./resources/fence_horizontal.png", 0, 0, 46, 32, 1, 50, 15, true);
      
    }
    update(gameEngine) {
        super.update(gameEngine);
        this.healthAPI.update(gameEngine);
        if (this.dead) {
            this.removeFromWorld = true;
            gameEngine.addEntity(new Log(this.x, this.y + 100));
        }
    }
}