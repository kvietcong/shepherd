class Camera {
    constructor(x = 0, y = 0, target = null, lerpRate = 5, isLerping = true) {
        this.x = x;
        this.y = y;
        this.lerpRate = lerpRate;
        this.target = target;
        this.isLerping = isLerping;
    }

    get["position"]() {
        return new Vector(this.x, this.y);
    }

    update(gameEngine) {
        if (this.target) {
            const newPosition = this.position.lerpTo(
                new Vector(this.target.x, this.target.y),
                this.isLerping ? gameEngine.deltaTime * this.lerpRate : 1
            );
            this.x = newPosition.x;
            this.y = newPosition.y;
        }
    }
}