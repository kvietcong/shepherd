// Everything has circle colliders XD
class Entity {
    constructor(x = 0, y, width, height) {
        if (!y) y = x;

        if (!width) {
            width = 100;
            height = 100;
        }
        if (width && !height) height = width;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.isZoomable = true;
        this.isRelative = true;

        this.animator;
    }

    setAnimator(animator) {
        this.animator = animator;
    }

    collidesWith(other) {
        if ( this.x < other.x + other.width
          && this.x + this.width > other.x
          && this.y < other.y + other.height
          && this.y + this.height > other.y
        ) {
            return true;
        } else return false
    }

    get xCenter() { return this.x + this.width / 2; }
    get yCenter() { return this.y + this.height / 2; }

    distanceTo(other) {
        return getDistance(this.xCenter, this.yCenter,
                           other.xCenter, other.yCenter);
    }

    update(gameEngine) {
        if (this.animator) this.animator.update(gameEngine);
    }

    draw(ctx, gameEngine) {
        if (this.animator) this.animator.getDrawFunction()(ctx, this.x, this.y);

        // Collision Box
        if (params.isDebugging) {
            ctx.fillStyle = rgba(255, 0, 0, 0.2);
            ctx.fillRect(this.x, this.y, this.width, this.height);

            ctx.strokeStyle = "red";
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

class Shepherd extends Entity {

}

class Sheep extends Entity {
    constructor(x, y, velocity, maxSpeed = 200) {
        super(x, y, 20, 20);
        this.velocity = velocity || Vector.randomUnitVector();
        this.detectionRadius = this.width * 10;
        this.flockingRadius = this.detectionRadius * 2;
        this.maxSpeed = maxSpeed;
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
        });

        const separation = averageRepel.scale(1/close).unit;
        const cohesion = averagePosition.scale(1/flock)
            .subtract(this.x, this.y).unit;
        const alignment = averageDirection.scale(1/flock).unit;

        // Separation
        this.velocity.lerpToInPlace(
            separation.scale(this.maxSpeed * 18),
            1 * gameEngine.deltaTime
        );

        // Cohesion
        this.velocity.lerpToInPlace(
            cohesion.scale(this.maxSpeed * 10),
            1 * gameEngine.deltaTime
        );

        // Alignment
        this.velocity.lerpToInPlace(
            alignment.scale(this.maxSpeed * 300),
            1 * gameEngine.deltaTime
        );

        this.velocity.setUnit().scaleInPlace(this.maxSpeed);

        // This commented out part is attempting to do cardinal directions

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

        this.x += this.velocity.x * gameEngine.deltaTime;
        this.y += this.velocity.y * gameEngine.deltaTime;
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

class Wolf extends Entity {

}