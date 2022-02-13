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
class Icon extends GUIElement {
    constructor(source, x, y, width, height, symbol) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.source = source;
        this.symbol = symbol;
    }
    draw(ctx, gameEngine) {
        ctx.fillStyle = 'tan';
        ctx.strokeStyle = 'black';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1;
        ctx.drawImage(this.source, this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.font = "30px impact";
        ctx.fillText(this.symbol, this.x + .4*this.width, this.y + .8*this.height, this.width);
    }
}
// Shared Offscreen Canvas to manipulate images with.
GUIElement.offscreenCanvas = document.createElement("canvas");
GUIElement.offscreenContext = GUIElement.offscreenCanvas.getContext("2d");

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
        const x = this.centeredOn.xCenter ?? this.centeredOn.x;
        const y = this.centeredOn.yCenter ?? this.centeredOn.y;

        const { offscreenCanvas, offscreenContext } = GUIElement;
        offscreenContext.save();
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
        offscreenContext.translate(-x * this.zoom + radius, -y * this.zoom + radius);
        offscreenContext.scale(this.zoom, this.zoom);

        this.mapElements.forEach(element => element.draw(offscreenContext));
        gameEngine.entities.forEach(entity => {
            if (!(entity instanceof Entity)) return;

            const { x, y, width, height } = entity;
            offscreenContext.beginPath();
            offscreenContext.fillStyle = entity instanceof Wolf
                ? "red"
                : entity instanceof Sheep
                    ? "cyan"
                    : entity instanceof Shepherd
                        ? "salmon"
                        : "gray";
            offscreenContext.fillRect(x, y, width, height);
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