const makeObAnim = () => {
    const size = 96;
    const obAnimations = {
        only: { frameAmount: 1, startX: 0, startY: 0}

    }
    const obstacle = assetManager.getAsset("./resources/3.png");
    return new Animator(obstacle, "only", obAnimations, 43, 38, 1/30, 2);
};

class Obstacle extends Entity {
    constructor(x, y){
        //Object.assign(this, {x, y});
        super(x, y, 96, 96);
        this.setAnimator(makeObAnim());
    }

    update(gameEngine){
        super.update(gameEngine);

        gameEngine.entities.forEach(entity => {
            if (entity === this) return;
           
            // Avoid Overlap
            if (this.collidesWith(entity)) {
                console.log("collision detected with obstacle: " + this);
            }
        });
    }

    draw(ctx, gameEngine){
        super.draw(ctx, gameEngine);
    }
}