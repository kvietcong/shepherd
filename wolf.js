params.wolf = {
    separationFactor: 30,
    cohesionFactor: 5,
    alignmentFactor: 400,
    chaseFactor: 50,
};

const makeWolfAnimator = (color = "brown") => {
    const size = 48;
    const frameAmount = 3;
    const wolfAnimations = {
        staticForward: { frameAmount: 1, startX: 1 * size, startY: 0 * size  },
        staticLeft: { frameAmount: 1, startX: 1 * size, startY: 1 * size  },
        staticRight: { frameAmount: 1, startX: 1 * size, startY: 2 * size  },
        staticBack: { frameAmount: 1, startX: 1 * size, startY: 3 * size  },

        walkS: { frameAmount, startX: 6 * size, startY: 0 * size  },
        walkW: { frameAmount, startX: 6 * size, startY: 1 * size  },
        walkE: { frameAmount, startX: 6 * size, startY: 2 * size  },
        walkN: { frameAmount, startX: 6 * size, startY: 3 * size  },

        walkNE: { frameAmount, startX: 6 * size, startY: 3 * size  },
        walkNW: { frameAmount, startX: 6 * size, startY: 3 * size  },
        walkSE: { frameAmount, startX: 6 * size, startY: 0 * size  },
        walkSW: { frameAmount, startX: 6 * size, startY: 0 * size  },
    };
    const wolf = assetManager.getAsset("./resources/wolf.png");
    return new Animator(
        wolf, "walkS", wolfAnimations, size, size, 1/12, scale=1.3
    );
};

class Wolf extends Entity {
    constructor(x, y, velocity, walkSpeed = 60, maxSpeed = 110) {
        super(x, y, 40, 20);
        // movement
        this.velocity = velocity || Vector.randomUnitVector();
        this.detectionRadius = this.width * 12;
        this.flockingRadius = this.detectionRadius * 2;
        this.walkSpeed = walkSpeed;
        this.maxSpeed = maxSpeed;

        // interactions
        this.healthAPI = new HealthAPI(
            100, 100, 1.5, true, true
        ).attachShortcutsTo(this);
        this.health = 3;
        this.dead = false;
        this.resting = false;
        this.timeSinceRest = 0;
        this.restTime = 3;
        this.damage = 50;

        // media
        this.setAnimator(makeWolfAnimator());
        this.animator.setIsLooping();
        this.animator.play();
    }

    attacked(damage) {
        //console.log("wolf is dealt damage");
        this.healthAPI.damage(damage);
        this.animator.untint();
        this.animator.tint("red", this.restTime, 0.6);
        this.resting = true;
        this.timeSinceRest = 0;
        if (this.healthAPI.health <= 0) {
            inventory.addGold(params.inventory.wolfReward);
            console.log("gold: " + inventory.gold);
            this.dead = true;
            this.animator.setAnimation("staticRight");
        }
    }

    update(gameEngine) {
        super.update(gameEngine);
        this.healthAPI.update(gameEngine);

        // Check if resting or dead before updating
        if (this.resting || this.dead) {
            this.timeSinceRest += gameEngine.deltaTime;
            if (this.timeSinceRest >= this.restTime) {
                this.resting = false;
                if (this.dead) this.removeFromWorld = true;
            }
            if (this.resting || this.dead) return;
        };

        const averagePosition = this.position;
        const averageDirection = this.velocity.clone();
        const averageRepel = this.velocity.unit.scale(-1);

        let closestSheep = null;

        let flock = 1;
        let close = 1;

        gameEngine.entities.forEach(entity => {
            if (entity === this || entity.resting) return;

            // Update vectors
            const distance = this.distanceTo(entity);
            if (entity instanceof Sheep && !entity.dead) {
                if (
                    (distance < this.detectionRadius)
                    && (!closestSheep || (distance < closestSheep.distanceTo(this)))
                ) {
                    closestSheep = entity;
                }
            }
            if (entity instanceof Wolf) {
                // Cohesion and Alignment
                if (distance < this.flockingRadius) {
                    flock++;
                    averagePosition.addInPlace(entity.x, entity.y);
                    averageDirection.addInPlace(entity.velocity.unit);
                }

                // Separation
                if (distance < this.detectionRadius) {
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
            }

            // Check collisions
            if (this.collidesWith(entity)) {
                if (entity instanceof Sheep) {
                    if (!this.resting && !entity.dead) {
                        this.timeSinceRest = 0;
                        entity.attacked(this.damage);
                        this.animator.untint();
                        this.animator.tint("cyan", this.restTime, 0.2);
                        this.resting = true;
                    }
                } else if (entity instanceof Obstacle && entity.isCollidable) {
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

        const {
            separationFactor, cohesionFactor, alignmentFactor, chaseFactor
        } = params.wolf;

        const speed = closestSheep ? this.maxSpeed : this.walkSpeed;

        // Separation
        const separation = averageRepel.scale(1/close).unit;
        this.velocity.lerpToInPlace(
            separation.scale(speed * separationFactor),
            1 * gameEngine.deltaTime
        );

        // Cohesion
        const cohesion = averagePosition.scale(1/flock)
            .subtract(this.x, this.y).unit;
        this.velocity.lerpToInPlace(
            cohesion.scale(speed * cohesionFactor),
            1 * gameEngine.deltaTime
        );

        // Alignment
        const alignment = averageDirection.scale(1/flock).unit;
        this.velocity.lerpToInPlace(
            alignment.scale(speed * alignmentFactor),
            1 * gameEngine.deltaTime
        );

        // Chase
        if (closestSheep) {
            const chase = closestSheep.position.subtract(this.x, this.y).unit;
            this.velocity.lerpToInPlace(
                chase.scale(speed * chaseFactor),
                1 * gameEngine.deltaTime
            );
        }

        this.velocity.setUnit().scaleInPlace(speed);

        // Visual
        if (!this.velocity.magnitude) return;
        const directionInfo = {
            walkS: new Vector(0, 1),
            walkE: new Vector(1, 0),
            walkN: new Vector(0, -1),
            walkW: new Vector(-1, 0),

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
            75, 10,
            ctx, gameEngine);

        // Directional Line
        if (params.isDebugging) {
            const debugLine = this.velocity.unit.scale(30);
            ctx.beginPath();
            ctx.moveTo(this.xCenter + debugLine.x, this.yCenter + debugLine.y);
            ctx.lineTo(this.xCenter, this.yCenter);
            ctx.stroke();
        }
    }
}