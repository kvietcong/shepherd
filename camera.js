class Camera {
    constructor(x = 0, y = 0, target = null, lerpRate = 5, isLerping = true, zoom = 1, zoomMax = 2, zoomMin = 0.5) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.lerpRate = lerpRate;
        this.isLerping = isLerping;

        this._zoom = zoom;
        this.zoomMin = zoomMin;
        this.zoomMax = zoomMax;
    }

    get position() {
        return new Vector(this.x, this.y);
    }

    get zoom() { return this._zoom; }
    set zoom(zoom) {
        this._zoom = zoom;
        if (this._zoom < this.zoomMin) this._zoom = this.zoomMin;
        if (this._zoom > this.zoomMax) this._zoom = this.zoomMax;
    }

    update(gameEngine) {
        if (this.target && this.target.x && this.target.y) {
            const newPosition = this.position.lerpTo(
                new Vector(this.target.x, this.target.y),
                this.isLerping ? gameEngine.deltaTime * this.lerpRate : 1
            );
            this.x = newPosition.x;
            this.y = newPosition.y;
        }

        if (gameEngine.wheel) {
            if (gameEngine.wheel.deltaY < 0) {
                this.zoom += 0.05;
            } else if (gameEngine.wheel.deltaY > 0) {
                this.zoom -= 0.05;
            }
            gameEngine.wheel = null;
        }
    }
}