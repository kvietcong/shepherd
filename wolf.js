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

        walkForward: { frameAmount, startX: 0 * size, startY: 0 * size  },
        walkLeft: { frameAmount, startX: 0 * size, startY: 1 * size  },
        walkRight: { frameAmount, startX: 0 * size, startY: 2 * size  },
        walkBack: { frameAmount, startX: 0 * size, startY: 3 * size  },
    };
    const wolf = assetManager.getAsset("./resources/wolf.png");
    return new Animator(
        wolf, "walkForward", wolfAnimations, size, size, 1/12
    );
};

class Wolf extends Entity {
    constructor(x, y, velocity, maxSpeed = 150) {
        super(x, y, 30, 30);
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

        this.x += this.velocity.x * gameEngine.deltaTime;
        this.y += this.velocity.y * gameEngine.deltaTime;

        // Visual
        const angleFromForward = normalizeAngle(
            this.velocity.angleTo(new Vector(1, 0)) * 180 / PI
        );

        const angleFromRight = normalizeAngle(
            this.velocity.angleTo(new Vector(1, 0)) * 180 / PI
        );

        const angleFromBack = normalizeAngle(
            this.velocity.angleTo(new Vector(0, -1)) * 180 / PI
        );

        const angleFromLeft = normalizeAngle(
            this.velocity.angleTo(new Vector(-1, 0)) * 180 / PI
        );

        const directions = {
            walkForward: angleFromForward,
            walkRight: angleFromRight,
            walkBack: angleFromBack,
            walkLeft: angleFromLeft,
        };

        const directionArray = Object.keys(directions);
        directionArray.sort((a, b) => directions[a] - directions[b]);
        this.animator.setAnimation(directionArray[0]);
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