class Camera {
    constructor(
        x = 0, y = 0,
        lerpRate = 5, isLerping = true,
        zoom = 1, zoomMax = 2, zoomMin = 0.8
    ) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.lerpRate = lerpRate;
        this.isLerping = isLerping;

        this._zoom = zoom;
        this.zoomMin = zoomMin;
        this.zoomMax = zoomMax;

        this.following = null;
        this.isFollowing = false;
    }

    follow(entity) {
        this.following = entity;
        this.isFollowing = true;
    }

    unfollow() {
        this.isFollowing = false;
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
        const {
            w, a, s, d, q, e,
            ArrowRight: right, ArrowLeft: left, ArrowUp: up, ArrowDown: down,
            Shift, Control, Alt, click, rightclick
        } = gameEngine.keys;
        const space = gameEngine.keys[" "];

        if (w || a || s || d || space || click || rightclick) this.follow(this.following);

        if (((right || left || up || down) && !Control && !Shift && !Alt)
            || ((w || a || s || d) && Alt)
        ) {
            this.unfollow();
            if (right || d) this.targetX += 8;
            if (left || a) this.targetX -= 8;
            if (up || w) this.targetY -= 8;
            if (down || s) this.targetY += 8;
        }

        if (this.isFollowing && this.follow) {
            this.targetX = this.following.xCenter;
            this.targetY = this.following.yCenter;
        }

        // Update Camera Position
        const newPosition = this.position.lerpTo(
            new Vector(this.targetX, this.targetY),
            this.isLerping ? gameEngine.deltaTime * this.lerpRate : 1
        );
        this.x = newPosition.x;
        this.y = newPosition.y;

        // Zooming
        if (Control) {
            if (up) this.zoom += 0.01;
            if (down) this.zoom -= 0.01;
        }

        if (gameEngine.wheel && !Alt) {
            if (gameEngine.wheel.deltaY < 0) {
                this.zoom += 0.05;
            } else if (gameEngine.wheel.deltaY > 0) {
                this.zoom -= 0.05;
            }
        }
    }
}