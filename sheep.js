params.sheep = {};

attachPropertiesWithCallbacks(params.sheep, [
    [ "separationFactor", 40 ],
    [ "cohesionFactor", 10 ],
    [ "alignmentFactor", 300 ],
    [ "shepherdFactor", 30 ],
    [ "wolfFactor", 100 ],
    [ "walkSpeed", 100 ],
    [ "maxSpeed", 200 ],
    [ "barnFactor", 20],
    [ "obstacleFactor", 50 ],
    [ "modifications", {} ]
]);

const changeLevelCallback = (level, id) => {
    const element = document.getElementById(id);
    if (element) element.innerText = level;
};
attachPropertiesWithCallbacks(params.sheep.modifications, [
    [ "maxSpeed", 0, changeLevelCallback ],
    [ "separationFactor", 0, changeLevelCallback ],
    [ "cohesionFactor", 0, changeLevelCallback ],
    [ "alignmentFactor", 0, changeLevelCallback ],
    [ "wolfFactor", 0, changeLevelCallback ],
    [ "shepherdFactor", 0, changeLevelCallback ],
    // [ "barnFactor", 0, changeLevelCallback ],
    // [ "obstacleFactor", 0, changeLevelCallback ],
]);

const makeSheepAnimator = () => {
    const size = 128;
    const sheepAnimations = {
        staticE: {frameAmount: 1, startX: 0, startY: 0},
        staticW: {frameAmount: 1, startX: 0, startY: size},
        staticNE: {frameAmount: 1, startX: 0, startY: 2 * size},
        staticNW: {frameAmount: 1, startX: 0, startY: 3 * size},
        staticSE: {frameAmount: 1, startX: 0, startY: 4 * size},
        staticSW: {frameAmount: 1, startX: 0, startY: 5 * size},
        staticN: {frameAmount: 1, startX: 0, startY: 6 * size},
        staticS: {frameAmount: 1, startX: 0, startY: 7 * size},

        walkE: {frameAmount: 7, startX: 0, startY: 0},
        walkW: {frameAmount: 7, startX: 0, startY: size},
        walkNE: {frameAmount: 7, startX: 0, startY: 2 * size},
        walkNW: {frameAmount: 7, startX: 0, startY: 3 * size},
        walkSE: {frameAmount: 7, startX: 0, startY: 4 * size},
        walkSW: {frameAmount: 7, startX: 0, startY: 5 * size},
        walkN: {frameAmount: 7, startX: 0, startY: 6 * size},
        walkS: {frameAmount: 7, startX: 0, startY: 7 * size}
    };

    const sheep = assetManager.getAsset("./resources/sheep.png");
    return new Animator(
        sheep, "walkSE", sheepAnimations, size, size, 1/15, scale=0.5
    );
};

class Sheep extends Entity {

    constructor(x, y, velocity) {
        super(x, y, 50, 20);
        Sheep.count++;
        // movement
        this.velocity = velocity || Vector.randomUnitVector();
        this.detectionRadius = this.width * 4;
        this.flockingRadius = this.detectionRadius * 2;

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
        this.staticFrames = {
            "walkE": "staticE",
            "walkW": "staticW",
            "walkN": "staticN",
            "walkS": "staticS",
            "walkNE": "staticNE",
            "walkNW": "staticNW",
            "walkSE": "staticSE",
            "walkSW": "staticSW"
        }
    }

    attacked(damage) {
        this.healthAPI.damage(damage);
        this.animator.untint();
        this.animator.tint("red", this.deathLength, 0.5);
        assetManager.playSound('sheep_baa', 0.5);
        if (this.healthAPI.health <= 0) {
            this.dead = true;
            Sheep.count--;
            if (this.animator.currentAnimationKey in this.staticFrames)
                this.animator.setAnimation(this.staticFrames[this.animator.currentAnimationKey]);
        }
    }

    update(gameEngine) {
        super.update(gameEngine);
        this.healthAPI.update(gameEngine);

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
        const averageBarnDirection = this.velocity.clone();
        const averageObstacleRepel = this.velocity.unit.scale(-1);

        let shepherd = null;
        // let toObstacle = null;
        // let newDirection = null;

        let flock = 1;
        let close = 1;
        let obstacles = 1;

        gameEngine.entities.forEach(entity => {
            if (entity === this) return;

            const distance = this.distanceTo(entity);
            if (entity instanceof Barn) {
                if (distance < this.detectionRadius / 2) {
                    // Be attracted to barn?
                    averageBarnDirection.addInPlace(
                        new Vector(entity.x - this.x, entity.y - this.y).setUnit()
                    )
                }
            } else if (entity instanceof Obstacle) {
                if (distance < this.detectionRadius / 2) {
                    averageObstacleRepel.addInPlace(
                        new Vector(entity.x - this.x, entity.y - this.y)
                            .setUnit().scale(-1)
                    )
                    obstacles++;
                }
            }
            if (entity instanceof Shepherd) {
                shepherd = entity;
            }
            if (entity instanceof Wolf) {
                if (distance < this.detectionRadius) {
                    averageWolfRepel.addInPlace(
                        new Vector(entity.x - this.x, entity.y - this.y)
                            .setUnit().scale(-1)
                    );
                    //close++;
                }
            }
            if (entity instanceof Sheep && !entity.dead) {
                // Cohesion and Alignment
                if (distance < this.flockingRadius) {
                    flock++;
                    averagePosition.addInPlace(entity.x, entity.y);
                    averageDirection.addInPlace(entity.velocity.unit);
                }
                // Build average vector to the shepherd
                //averageToShep.addInPlace(new Vector(this.shepherd.x - entity.x, this.shepherd.y - entity.y).unit);

                // Separation
                if (distance < this.detectionRadius) {
                    averageRepel.addInPlace(
                        new Vector(entity.x - this.x, entity.y - this.y)
                            .setUnit().scale(-1)
                    );
                    close++;
                }

                // Avoid Overlap
                if (this.collidesWith(entity)) {
                    averageRepel.addInPlace(
                        new Vector(entity.x - this.x, entity.y - this.y)
                            .setUnit().scale(-50)
                    );
                    close++;
                }
            }

            // Check collisions
            if (this.collidesWith(entity)) {
                if (entity instanceof Barn) {
                    this.removeFromWorld = true;
                    Barn.sheepCount++;
                    assetManager.playSound("ding_3", 0.5);
                    inventory.gold += params.inventory.sheepReward;
                } else if (entity instanceof Obstacle && entity.isCollidable) {
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

        // if (toObstacle) {
        //     newDirection = toObstacle.x.magnitude > toObstacle.y.magnitude ?
        //         new Vector(0, -1)
        //         :
        //         new Vector(-1, 0);
        // }

        const separation = averageRepel.scale(1/close).unit;
        const wolfRepel = averageWolfRepel.scale(1/close).unit;
        const cohesion = averagePosition.scale(1/flock).subtract(this.x, this.y).unit;
        const alignment = averageDirection.scale(1/flock).unit;
        const distToShep = new Vector(shepherd.x - this.x, shepherd.y - this.y);
        const shepAlignment = distToShep.magnitude < 75 ? distToShep.scale(-75).unit : distToShep.scale(50).unit;
        const barnAlignment = averageBarnDirection.scale(1/flock).unit;
        const obstacleRepel = averageObstacleRepel.scale(1/obstacles).unit;

        const {
            separationFactor, cohesionFactor, alignmentFactor, shepherdFactor, wolfFactor, barnFactor, obstacleFactor
        } = params.sheep;

        //const speed = this.maxSpeed * distToShep / 100
        const speed = (distToShep.magnitude < this.detectionRadius * 5)
            ? (params.sheep.maxSpeed + params.sheep.modifications.maxSpeed * 5)
            : params.sheep.walkSpeed;

        // Separation
        this.velocity.lerpToInPlace(
            separation.scale(speed * (separationFactor + params.sheep.modifications.separationFactor * 8)),
            1 * gameEngine.deltaTime
        );

        // Cohesion
        this.velocity.lerpToInPlace(
            cohesion.scale(speed * (cohesionFactor + params.sheep.modifications.cohesionFactor * 5)),
            1 * gameEngine.deltaTime
        );

        // Alignment
        this.velocity.lerpToInPlace(
            alignment.scale(speed * (alignmentFactor + params.sheep.modifications.alignmentFactor * 8)),
            1 * gameEngine.deltaTime
        );

        // Align to shepherd
        this.velocity.lerpToInPlace(
            shepAlignment.scale(speed * (shepherdFactor + params.sheep.modifications.shepherdFactor * 2)),
            1 * gameEngine.deltaTime
        );

        // Repel from Wolf
        this.velocity.lerpToInPlace(
            wolfRepel.scale(speed * (wolfFactor + params.sheep.modifications.wolfFactor * 8)),
            1 * gameEngine.deltaTime
        );

        // Repel from Obstacles
        this.velocity.lerpToInPlace(
            obstacleRepel.scale(speed * obstacleFactor),
            1 * gameEngine.deltaTime
        );

        // Align to Barn
        this.velocity.lerpToInPlace(
            barnAlignment.scale(speed * barnFactor),
            1 * gameEngine.deltaTime
        );

        this.velocity.setUnit().scaleInPlace(speed);

        // Visual
        if (!this.velocity.magnitude) return;
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

        this.animator.setAnimation(direction);

        // Movement
        this.x += Math.abs(this.velocity.x) * directionInfo[direction].x * gameEngine.deltaTime;
        this.y += Math.abs(this.velocity.y) * directionInfo[direction].y * gameEngine.deltaTime;
    }

    draw(ctx, gameEngine) {
        super.draw(ctx, gameEngine);
        this.healthAPI.draw(
            this.xCenter, this.y - 35,
            65, 10,
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

Sheep.count = 0;