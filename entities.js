// Everything has circle colliders XD
class Entity {
    constructor(x = 0, y = 0, radius = 100, animator = null) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    collidesWith(other) {
        return this.radius + other.radius > this.distanceTo(other);
    }

    distanceTo(other) {
        return sqrt(pow(this.x - other.x, 2) + pow(this.y - other.y, 2));
    }

    update(gameEngine) {
        if (this.animator) this.animator.update(gameEngine);
    }

    draw(ctx, gameEngine) {
        if (this.animator) this.animator.getDrawFunction()(ctx, this.x, this.y);
        if (params.isDebugging) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * PI);

            ctx.fillStyle = rgba(255, 0, 0, 0.2);
            ctx.fill();

            ctx.strokeStyle = "red";
            ctx.stroke();
        }
    }
}

class Shepherd extends Entity {

}

class Sheep extends Entity {
    constructor(x, y, velocity, maxSpeed = 200, radius = 10) {
        super(x, y, radius);
        this.velocity = velocity || Vector.randomUnitVector();
        this.detectionRadius = this.radius * 10;
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
            if (getDistance(this.x, this.y, entity.x, entity.y) < this.flockingRadius + entity.radius) {
                flock++;
                averagePosition.addInPlace(entity.x, entity.y);
                averageDirection.addInPlace(entity.velocity.unit);
            }

            // Separation
            if (getDistance(this.x, this.y, entity.x, entity.y) < this.detectionRadius + entity.radius) {
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

        if (params.isDebugging) {
            const debugLine = this.velocity.unit.scale(25);
            ctx.beginPath();
            ctx.moveTo(this.x + debugLine.x, this.y + debugLine.y);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();
        }
    }
}

class Wolf extends Entity {

}