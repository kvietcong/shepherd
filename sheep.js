params.sheep = {
    separationFactor: 18,
    cohesionFactor: 10,
    alignmentFactor: 300,
};

const makeSheepAnimator = () => {
    const size = 64;
    const sheepAnimations = {
        walkRight: {frameAmount: 7, startX: 0, startY: 0},
        walkLeft: {frameAmount: 7, startX: 0, startY: size},
        walkUp: {frameAmount: 7, startX: 0, startY: 2 * size},
        walkDown: {frameAmount: 7, startX: 0, startY: 3 * size}
    };

    const sheep = assetManager.getAsset("./resources/sheep.png");
    return new Animator(
        sheep, "walkDown", sheepAnimations, size, size, 1/15
    );

};


class Sheep extends Entity {

    constructor(x, y, velocity, maxSpeed = 200) {
        super(x, y, 20, 20);
        this.velocity = velocity || Vector.randomUnitVector();
        this.detectionRadius = this.width * 4;
        this.flockingRadius = this.detectionRadius * 2;
        this.maxSpeed = maxSpeed;
        this.facing = 3; // 0 = right, 1 = left, 2 = up, 3 = down.
        this.setAnimator(makeSheepAnimator());
        this.animator.setIsLooping();
        this.animator.play();
    }

    update(gameEngine) {
        super.update(gameEngine);

        const averagePosition = new Vector(this.x, this.y);
        const averageDirection = this.velocity.clone();
        const averageRepel = this.velocity.unit.scale(-1);

        let flock = 1;
        let close = 1;

        gameEngine.entities.forEach(entity => {
            if (entity === this) return;
            //if (entity instanceof Wolf) return;
            if (!(entity instanceof Sheep)) return;

            // Cohesion and Alignment
            if (this.distanceTo(entity) < this.flockingRadius) {
                flock++;
                averagePosition.addInPlace(entity.x, entity.y);
                averageDirection.addInPlace(entity.velocity.unit);
            }

            // Separation
            if (this.distanceTo(entity) < this.detectionRadius) {
                averageRepel.addInPlace(
                    new Vector(entity.x - this.x, entity.y - this.y)
                        .unit.scale(-1)
                );
                close++;
            }

            // Avoid Overlap
            if (this.collidesWith(entity)) {
                averageRepel.addInPlace(
                    new Vector(entity.x - this.x, entity.y - this.y)
                        .unit.scale(-50)
                );
                close++;
            }
        });

        const separation = averageRepel.scale(1/close).unit;
        const cohesion = averagePosition.scale(1/flock)
            .subtract(this.x, this.y).unit;
        const alignment = averageDirection.scale(1/flock).unit;

        const {
            separationFactor, cohesionFactor, alignmentFactor
        } = params.sheep;

        // Separation
        this.velocity.lerpToInPlace(
            separation.scale(this.maxSpeed * separationFactor),
            1 * gameEngine.deltaTime
        );

        // Cohesion
        this.velocity.lerpToInPlace(
            cohesion.scale(this.maxSpeed * cohesionFactor),
            1 * gameEngine.deltaTime
        );

        // Alignment
        this.velocity.lerpToInPlace(
            alignment.scale(this.maxSpeed * alignmentFactor),
            1 * gameEngine.deltaTime
        );

        this.velocity.setUnit().scaleInPlace(this.maxSpeed);

        // This commented out part is attempting to do cardinal directions
        // It kind of failed miserably though

        // this.velocity = separation.scale(2)
        //     .add(cohesion.scale(1))
        //     .add(alignment.scale(3))
        //     .scale(1/3).unit.scale(this.maxSpeed);

        // const validDirections = [
        //     new Vector(1, 0),
        //     new Vector(0, 1),
        //     new Vector(-1, 0),
        //     new Vector(0, -1),

        //     new Vector(1, 1),
        //     new Vector(-1, 1),
        //     new Vector(-1, -1),
        //     new Vector(1, -1),
        // ];

        // validDirections.sort((a, b) => {
        //     return this.velocity.angleTo(a) - this.velocity.angleTo(b);
        // });

        // this.velocity = validDirections[0].clone();
        // this.velocity.scaleInPlace(this.maxSpeed);

        // Another attempt to do cardinal directions

        const validDirections = [
            new Vector(1, 0),
            new Vector(0, 1),
            new Vector(-1, 0),
            new Vector(0, -1)
        ];

        validDirections.sort((a, b) => {
            return this.velocity.angleTo(a)  - this.velocity.angleTo(b);
        });

        console.log(this.velocity)
        console.log(validDirections[0]);
        console.log(validDirections[0].x);
        console.log(validDirections[0].y);

        this.x += this.velocity.x * validDirections[0].x * gameEngine.deltaTime;
        this.y += this.velocity.y * validDirections[0].y * gameEngine.deltaTime;

        // this.x += this.velocity.x * gameEngine.deltaTime;
        // this.y += this.velocity.y * gameEngine.deltaTime;

        // Pick animation
        if (validDirections[0].x === 1 && validDirections[0].y === 0) {
            this.facing = 0; // up
        } else if (validDirections[0].x === 0 && validDirections[0].y === 1) {
            this.facing = 2; // right
        } else if (validDirections[0].x === -1 && validDirections[0].y === 0) {
            this.facing = 1; // left
        } else if (validDirections[0].x === 0 && validDirections[0].y === -1) {
            this.facing = 3; // down
        }

        const animationList = Object.keys(this.animator.animationInfo);
        this.animator.setAnimation(animationList[this.facing]);
    }

    draw(ctx, gameEngine) {
        super.draw(ctx, gameEngine);

        // Directional Line
        if (params.isDebugging) {
            const debugLine = this.velocity.unit.scale(25);
            ctx.beginPath();
            ctx.moveTo(this.xCenter + debugLine.x, this.yCenter + debugLine.y);
            ctx.lineTo(this.xCenter, this.yCenter);
            ctx.stroke();
        }
    }
}