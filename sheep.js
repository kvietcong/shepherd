// Keep This Comment: 18 se, 10 co, 300 al are good base factors for non-cardinal
params.sheep = {
    separationFactor: 30,
    cohesionFactor: 10,
    alignmentFactor: 300,
    shepherdFactor: 25,
    wolfFactor: 100
};

const makeSheepAnimator = () => {
    const size = 64;
    const sheepAnimations = {
        staticE: {frameAmount: 1, startX: 0, startY: 0},
        staticW: {frameAmount: 1, startX: 0, startY: size},
        staticN: {frameAmount: 1, startX: 0, startY: 2 * size},
        staticS: {frameAmount: 1, startX: 0, startY: 3 * size},

        walkE: {frameAmount: 7, startX: 0, startY: 0},
        walkW: {frameAmount: 7, startX: 0, startY: size},
        walkN: {frameAmount: 7, startX: 0, startY: 2 * size},
        walkS: {frameAmount: 7, startX: 0, startY: 3 * size},

        walkNW: {frameAmount: 7, startX: 0, startY: 2 * size},
        walkNE: {frameAmount: 7, startX: 0, startY: 2 * size},
        walkSW: {frameAmount: 7, startX: 0, startY: 3 * size},
        walkSE: {frameAmount: 7, startX: 0, startY: 3 * size}
    };

    const sheep = assetManager.getAsset("./resources/sheep.png");
    return new Animator(
        sheep, "walkS", sheepAnimations, size, size, 1/15
    );
};

class Sheep extends Entity {

    constructor(x, y, velocity, maxSpeed = 200) {
        super(x, y, 50, 20);
        // movement
        this.velocity = velocity || Vector.randomUnitVector();
        this.detectionRadius = this.width * 4;
        this.flockingRadius = this.detectionRadius * 2;
        this.maxSpeed = maxSpeed;

        // interactions
        this.healthAPI = new HealthAPI(
            100, 100, 1.5, true, true
        ).attachShortcutsTo(this);
        this.health = 3;
        this.dead = false;
        this.timeSinceDeath = 0;
        this.deathLength = 3;

        // media
        this.setAnimator(makeSheepAnimator());
        this.animator.setIsLooping();
        this.animator.play();
        this.sheepBaa = assetManager.getAsset("./resources/sheep_baa.mp3").cloneNode();
        this.sheepBaa.volume = 0.3; // TODO: make adjustable
    }

    attacked(damage) {
        this.healthAPI.damage(100);
        this.animator.untint();
        this.animator.tint("red", this.deathLength, 0.5);
        this.sheepBaa.play();
        if (this.healthAPI.health <= 0) {
            this.dead = true;
            this.animator.setAnimation("staticE");
        }
    }

    update(gameEngine) {
        super.update(gameEngine);
        this.healthAPI.update(gameEngine);

        gameEngine.entities.forEach(entity => {
            if (this.collidesWith(entity)) {
                if (entity instanceof Obstacle && entity.isCollidable) {
                    //if (entity instanceof Sheep) return;
                    if (this.y - 10 > entity.y - this.height && this.y + 10 < entity.y + entity.height) {
                        if (this.x < entity.x) this.x = entity.x - this.width;
                        if(this.x > entity.x) this.x = entity.x + entity.width;
                    } if (this.x > entity.x - this.width && this.x < entity.x + entity.width) {
                        if (this.y < entity.y) this.y = entity.y - this.height;
                        if (this.y > entity.y) this.y = entity.y + entity.height;
                    }
                }
            }
        });

        if (this.dead) {
            this.timeSinceDeath += gameEngine.deltaTime;
            if (this.timeSinceDeath >= this.deathLength) {
                this.removeFromWorld = true;
            }
            return;
        };

        const averagePosition = new Vector(this.x, this.y);
        const averageDirection = this.velocity.clone();
        const averageRepel = this.velocity.unit.scale(-1);
        //const averageToShep = new Vector(shepherd.x - this.x, shepherd.y - this.y);
        const averageWolfRepel = this.velocity.unit.scale(-1);

        let shepherd;

        let flock = 1;
        let close = 1;

        gameEngine.entities.forEach(entity => {
            if (entity === this) return;
            //if (entity instanceof Wolf) return;
            if (entity instanceof Shepherd) {
                // add distance check and check if shepherd is detected later
                shepherd = entity;
                return;
            }
            if (entity instanceof Wolf) {
                if (this.distanceTo(entity) < this.detectionRadius) {
                    averageWolfRepel.addInPlace(
                        new Vector(entity.x - this.x, entity.y - this.y)
                            .unit.scale(-1)
                    );
                    close++;
                }
                return;
            }
            if (!(entity instanceof Sheep || entity instanceof Wolf)) return;

            // Cohesion and Alignment
            if (this.distanceTo(entity) < this.flockingRadius) {
                flock++;
                averagePosition.addInPlace(entity.x, entity.y);
                averageDirection.addInPlace(entity.velocity.unit);
            }
            // Build average vector to the shepherd
            //averageToShep.addInPlace(new Vector(this.shepherd.x - entity.x, this.shepherd.y - entity.y).unit);

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
        const wolfRepel = averageWolfRepel.scale(1/close).unit;
        const cohesion = averagePosition.scale(1/flock)
            .subtract(this.x, this.y).unit;
        const alignment = averageDirection.scale(1/flock).unit;
        const distToShep = new Vector(shepherd.x - this.x, shepherd.y - this.y);
        const shepAlignment = distToShep.magnitude < 75 ? distToShep.scale(-75).unit : distToShep.scale(50 /* 1/50 * distToShep.magnitude */).unit;

        const {
            separationFactor, cohesionFactor, alignmentFactor, shepherdFactor, wolfFactor
        } = params.sheep;

        //const speed = this.maxSpeed * distToShep / 100
        const speed = this.maxSpeed;

        // Separation
        this.velocity.lerpToInPlace(
            separation.scale(speed * separationFactor),
            1 * gameEngine.deltaTime
        );

        // Cohesion
        this.velocity.lerpToInPlace(
            cohesion.scale(speed * cohesionFactor),
            1 * gameEngine.deltaTime
        );

        // Alignment
        this.velocity.lerpToInPlace(
            alignment.scale(speed * alignmentFactor),
            1 * gameEngine.deltaTime
        );

        // Align to shepherd
        this.velocity.lerpToInPlace(
            shepAlignment.scale(speed * shepherdFactor),
            1 * gameEngine.deltaTime
        );

        // Repel from Wolf
        this.velocity.lerpToInPlace(
            wolfRepel.scale(speed * wolfFactor),
            1 * gameEngine.deltaTime
        );

        this.velocity.setUnit().scaleInPlace(speed);

        // Attempt to do cardinal and ordinal directions
        // Note: In the game engine canvas, +y is down, -y is up
        const directionInfo = {
            // cardinal
            walkN: new Vector(0, -1),
            walkE: new Vector(1, 0),
            walkS: new Vector(0, 1),
            walkW: new Vector(-1, 0),

            // ordinal
            walkNE: new Vector(1, -1),
            walkNW: new Vector(-1, -1),
            walkSE: new Vector(1, 1),
            walkSW: new Vector(-1, 1)
        };

        const directions = Object.keys(directionInfo);
        // Sort to find the closest cardinal/ordinal direction
        directions.sort((a, b) => {
            return this.velocity.angleTo(directionInfo[a])  - this.velocity.angleTo(directionInfo[b]);
        });
        let direction = directions[0];

        // Scale with velocity x and y components
        this.x += Math.abs(this.velocity.x) * directionInfo[direction].x * gameEngine.deltaTime;
        this.y += Math.abs(this.velocity.y) * directionInfo[direction].y * gameEngine.deltaTime;

        //const animationList = Object.keys(this.animator.animationInfo);
        this.animator.setAnimation(direction);
    }

    draw(ctx, gameEngine) {
        super.draw(ctx, gameEngine);
        this.healthAPI.draw(
            this.xCenter, this.y - 35,
            75, 10,
            ctx, gameEngine);

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