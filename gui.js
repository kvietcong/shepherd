class GUIElement {
    constructor(x = 0, y) {
        if (!y) y = x;

        this.x = x; this.y = y;

        this.z = 5;
        this.isZoomable = false;
        this.isRelative = false;
    }

    update(gameEngine) { }

    draw(ctx) { throw new Error("Draw Please"); }
}

class CooldownTimer extends GUIElement {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    draw(ctx) { }
}