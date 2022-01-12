class Camera {
    constructor(x = 0, y = 0, lerpRate = 5, isLerping = true, zoom = 1, zoomMax = 2, zoomMin = 0.5) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.lerpRate = lerpRate;
        this.isLerping = isLerping;

        this._zoom = zoom;
        this.zoomMin = zoomMin;
        this.zoomMax = zoomMax;
    }

    setX(x) { this.targetX = x; }
    setY(y) { this.targetY = y; }

    setPosition(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    forceSetPosition(x, y) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
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
        // Update Camera Target
        if (gameEngine.rightclick) {
            this.targetX += gameEngine.rightclick.x - gameEngine.width / 2;
            this.targetY += gameEngine.rightclick.y - gameEngine.height / 2;
            gameEngine.rightclick = null;
        }
        if (gameEngine.keys.d) this.targetX += 8;
        if (gameEngine.keys.a) this.targetX -= 8;
        if (gameEngine.keys.w) this.targetY -= 8;
        if (gameEngine.keys.s) this.targetY += 8;

        // Update Camera Position
        const newPosition = this.position.lerpTo(
            new Vector(this.targetX, this.targetY),
            this.isLerping ? gameEngine.deltaTime * this.lerpRate : 1
        );
        this.x = newPosition.x;
        this.y = newPosition.y;

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