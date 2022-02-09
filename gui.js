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

// Shared Offscreen Canvas to manipulate images with.
GUIElement.offscreenCanvas = document.createElement("canvas");
GUIElement.offscreenContext = GUIElement.offscreenCanvas.getContext("2d");

class CooldownTimer extends GUIElement {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    draw(ctx) { }
}

class MiniMap extends GUIElement {
    constructor(mapElements, centeredOn, zoom = 0.2) {
        super();
        this.mapElements = mapElements;
        this.centeredOn = centeredOn;
        this.zoom = zoom;
    }

    draw(ctx, gameEngine) {
        const { width, height } = gameEngine;
        const radius = min(width, height) / 6;
        const { xCenter, yCenter } = this.centeredOn;

        const { offscreenCanvas, offscreenContext } = GUIElement;
        offscreenContext.save();
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
        offscreenContext.translate(-xCenter * this.zoom + radius, -yCenter * this.zoom + radius);
        offscreenContext.scale(this.zoom, this.zoom);

        this.mapElements.forEach(element => element.draw(offscreenContext));
        gameEngine.entities.forEach(entity => {
            if (!(entity instanceof Entity)) return;

            const { x, y } = entity;
            offscreenContext.beginPath();
            offscreenContext.arc(
                x, y, entity instanceof Shepherd ? 20 : 10, 0, 2 * PI);
            offscreenContext.fillStyle = entity instanceof Wolf
                ? "red"
                : entity instanceof Sheep
                    ? "cyan"
                    : entity instanceof Shepherd
                        ? "salmon"
                        : "black";
            offscreenContext.fill();
        });

        ctx.beginPath();
        ctx.arc(width - radius - 5, radius + 5, radius, 0, 2 * PI);
        ctx.clip()

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(width - radius - 5, radius + 5, radius, 0, 2 * PI);
        ctx.fill();

        ctx.drawImage(offscreenCanvas,
            0, 0,
            radius * 2, radius * 2,
            width - radius * 2 - 5, 5,
            radius * 2, radius * 2
        );

        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.arc(width - radius - 5, radius + 5, radius, 0, 2 * PI);
        ctx.stroke();

        offscreenContext.restore();
        offscreenContext.clearRect(0, 0, width, height);
    }
}