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

class Icon extends GUIElement {
    constructor(source, x, y, width, height, symbol) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.source = source;
        this.symbol = symbol;
    }
    draw(ctx, gameEngine) {
        if (this.symbol) {
            ctx.fillStyle = 'tan';
            ctx.strokeStyle = 'black';
            ctx.globalAlpha = 0.5;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if (this.source) {
            ctx.globalAlpha = 1;
            ctx.drawImage(this.source, this.x, this.y, this.width, this.height);
        }
        if (this.symbol) {
            ctx.fillStyle = 'white';
            ctx.font = "30px impact";
            ctx.fillText(this.symbol, this.x + .4*this.width, 
                this.y + .8*this.height, this.width);
        }
    }
}
class Screen extends Icon {
    constructor(source, x, y, width, height, z) {
        super(source, x, y, width, height);
        this.z = z;
    }
    update(gameEngine) {
        super.update(gameEngine);
    }
    draw(ctx, gameEngine) {
        super.draw(ctx, gameEngine);
        ctx.drawImage(this.source, this.x, this.y, this.width, this.height);
    }
    
}
class CooldownTimer extends GUIElement {
    constructor(x, y, width, height, time) {
        super(x, y, width, height);
        this.width = width;
        this.height = height;
        this.actionTimeElapsed = 0;
        this.time = time;
        this.z = 6;
    }
    update(gameEngine) {
        this.actionTimeElapsed += gameEngine.deltaTime;
        if (this.actionTimeElapsed > this.time) this.removeFromWorld = true;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.globalAlpha = .5;
        ctx.fillStyle = "black";
        ctx.moveTo(this.x + .5*this.width, this.y + .5*this.height);
        ctx.arc(this.x + .5*this.width, this.y + .5*this.height, .5*this.width, 0,2*this.actionTimeElapsed * PI/this.time, true);
        ctx.fill();
     }
}

class MiniMap extends GUIElement {
    constructor(mapElements, centeredOn, zoom = 0.125, zoomMax = 0.5, zoomMin = 0.05) {
        super();
        this.mapElements = mapElements;
        this.centeredOn = centeredOn;
        this._zoom = zoom;
        this.zoomMax = zoomMax;
        this.zoomMin = zoomMin;
    }

    get zoom() { return this._zoom; }
    set zoom(zoom) {
        this._zoom = zoom;
        if (this._zoom < this.zoomMin) this._zoom = this.zoomMin;
        if (this._zoom > this.zoomMax) this._zoom = this.zoomMax;
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

    update(gameEngine) {
        const { Shift, ArrowUp: Up, ArrowDown: Down } = gameEngine.keys;
        if (Shift) {
            if (Up) this.zoom += 0.0025;
            if (Down) this.zoom -= 0.0025;
            if (gameEngine.wheel?.deltaY < 0) this.zoom += 0.025;
            if (gameEngine.wheel?.deltaY > 0) this.zoom -= 0.025;
        }
    }
}