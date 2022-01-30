// IDK if this should be used. Kind of like a jank way to do interfaces.
class Serializable {
    constructor() {}
    serialize() { throw new Error("Not implemented!"); }
    static deserialize(data) { throw new Error("Not implemented!"); }
}

// Everything has circle colliders XD
class Entity {
    constructor(x = 0, y, width, height) {
        if (!y) y = x;

        if (!width) {
            width = 100;
            height = 100;
        }
        if (width && !height) height = width;

        this.x = x; this.y = y;
        this.width = width; this.height = height;

        this.isZoomable = true;
        this.isRelative = true;
        this.isCollidable = true;

        this.animator;
    }

    setAnimator(animator) {
        this.animator = animator;
    }

    serialize() {
        return {
            x: this.x, y: this.y,
            width: this.width, height: this.height,
            isZoomable: this.isZoomable,
            isRelative: this.isRelative,
            isCollidable: this.isCollidable,
            animatorData: this.animator.serialize(),
        };
    }

    static deserialize(data) {
        const {
            x, y,
            width, height,
            isZoomable, isRelative, isCollidable,
            animatorData,
        } = data;
        const entity = new Entity(x, y, width, height);
        const animator = Animator.deserialize(animatorData);

        entity.isZoomable = isZoomable;
        entity.isRelative = isRelative;
        entity.isCollidable = isCollidable;
        entity.setAnimator(animator);

        return entity;
    }

    /**
     * Sees if this entity is colliding with another entity
     * (Ignores isCollidable. Check with that boolean to see if you want to
     *  act on the information returned here)
     * @param {Entity} other Other entity that can be collided with
     * @returns A object with the collision rectangle and where it has collided
     *         (false if no collision)
     */
    collidesWith(other) {
        const isCollidingRight = this.x + this.width > other.x;
        const isCollidingLeft = this.x < other.x + other.width;
        const isCollidingTop = this.y < other.y + other.height;
        const isCollidingBottom = this.y + this.height > other.y;

        if (isCollidingRight && isCollidingLeft
            && isCollidingTop && isCollidingBottom
        ) {
            // Auto Generated. Haven't checked XD
            return {
                x: this.x < other.x ? other.x : this.x,
                y: this.y < other.y ? other.y : this.y,
                width: this.x + this.width > other.x + other.width
                    ? other.x + other.width - this.x
                    : this.x + this.width - other.x,
                height: this.y + this.height > other.y + other.height
                    ? other.y + other.height - this.y
                    : this.y + this.height - other.y,

                isCollidingLeft, isCollidingRight,
                isCollidingTop, isCollidingBottom,
            };
        } else return false;
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
        if (this.animator)
            this.animator.getDrawFunction()(ctx, this.xCenter, this.yCenter);

        // Collision Box
        if (params.isDebugging) {
            ctx.fillStyle = rgba(255, 0, 0, 0.2);
            ctx.fillRect(this.x, this.y, this.width, this.height);

            ctx.strokeStyle = "red";
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    get position() {
        return new Vector(this.x, this.y);
    }
}