/*
const makeObAnim = () => {
    const size = 96;
    const obAnimations = {
        only: { frameAmount: 1, startX: 0, startY: 0}

    }
    let obstacle = assetManager.getAsset("./resources/1.png");
    if (this.src == 1){
        obstacle = assetManager.getAsset("./resources/3.png");
    }
    return new Animator(obstacle, "only", obAnimations, 43, 38, 1/30, 2);
};
*/
class Obstacle extends Entity {
    constructor(x, y, src){
        //Object.assign(this, {x, y});
        super(x, y, 96, 96);
        this.src = src;
        const obAnimations = {
            only: { frameAmount: 1, startX: 0, startY: 0}
    
        }
        let obstacle = assetManager.getAsset(this.src);
        let obAnim = new Animator(obstacle, "only", obAnimations, 43, 38, 1/30, 2);
        this.setAnimator(obAnim);
        //this.setAnimator(makeObAnim());
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