// Everything has circle colliders XD
class Entity {
    constructor(x = 0, y = 0, radius = 10, animator = null) {
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

}

class Wolf extends Entity {

}