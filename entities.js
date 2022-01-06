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

        let flock = 1;

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
                const vectorTo =
                    new Vector(entity.x - this.x, entity.y - this.y);
                this.velocity.lerpToInPlace(
                    vectorTo.scale(-2000 / vectorTo.magnitude),
                    1 * gameEngine.deltaTime
                );
            }
        });

        // Cohesion
        this.velocity.lerpToInPlace(
            averagePosition.scale(1/flock).subtract(this.x, this.y).unit.scale(this.maxSpeed * 10),
            1 * gameEngine.deltaTime
        );

        // Alignment
        this.velocity.lerpToInPlace(
            averageDirection.scale(1/flock).unit.scale(this.maxSpeed * 300),
            1 * gameEngine.deltaTime
        );

        this.velocity.setUnit().scaleInPlace(this.maxSpeed);

        this.x += this.velocity.x * gameEngine.deltaTime;
        this.y += this.velocity.y * gameEngine.deltaTime;

        if (gameEngine.options.hasWorldBorder) {
            const worldWidth = gameEngine.width * 2;
            const worldHeight = gameEngine.height * 2;
            if (this.x > worldWidth) this.x = 0;
            if (this.y > worldHeight) this.y = 0;
            if (this.x < 0) this.x = worldWidth;
            if (this.y < 0) this.y = worldHeight;
        }
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