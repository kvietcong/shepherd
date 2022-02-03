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
        wolf, "walkS", wolfAnimations, size, size, 1/12
    );
};

class Wolf extends Entity {
    constructor(x, y, velocity, maxSpeed = 150) {
        super(x, y, 40, 20);
        this.velocity = velocity || Vector.randomUnitVector();
        this.detectionRadius = this.width * 4;
        this.flockingRadius = this.detectionRadius * 2;
        this.maxSpeed = maxSpeed;

        this.setAnimator(makeWolfAnimator());
        this.animator.setIsLooping();
        this.animator.play();
    }

    update(gameEngine) {
        super.update(gameEngine);

        const averagePosition = this.position;
        const averageDirection = this.velocity.clone();
        const averageRepel = this.velocity.unit.scale(-1);

        let closestSheep = null;

        let flock = 1;
        let close = 1;

        gameEngine.entities.forEach(entity => {
            if (entity === this) return;
            const distance = this.distanceTo(entity);

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

            if (entity instanceof Sheep) {
                if ((distance < this.detectionRadius)
                 && (!closestSheep
                    || (distance < closestSheep.distanceTo(this)))
                ) {
                    closestSheep = entity;
                }
            }
        });

        const {
            separationFactor, cohesionFactor, alignmentFactor, chaseFactor
        } = params.wolf;

        // Separation
        const separation = averageRepel.scale(1/close).unit;
        this.velocity.lerpToInPlace(
            separation.scale(this.maxSpeed * separationFactor),
            1 * gameEngine.deltaTime
        );

        // Cohesion
        const cohesion = averagePosition.scale(1/flock)
            .subtract(this.x, this.y).unit;
        this.velocity.lerpToInPlace(
            cohesion.scale(this.maxSpeed * cohesionFactor),
            1 * gameEngine.deltaTime
        );

        // Alignment
        const alignment = averageDirection.scale(1/flock).unit;
        this.velocity.lerpToInPlace(
            alignment.scale(this.maxSpeed * alignmentFactor),
            1 * gameEngine.deltaTime
        );

        // Chase
        if (closestSheep) {
            const chase = closestSheep.position.subtract(this.x, this.y).unit;
            this.velocity.lerpToInPlace(
                chase.scale(this.maxSpeed * chaseFactor),
                1 * gameEngine.deltaTime
            );
        }

        this.velocity.setUnit().scaleInPlace(this.maxSpeed);

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