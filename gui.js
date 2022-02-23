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
    constructor(source, x, y, width, height, text) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.source = source;
        this.text = text;
    }
    draw(ctx, gameEngine) {
        //x= 1210, y = 681.
        //x= 906, y = 510.
        let scaleX = ctx.canvas.width/1210;
        let scaleY = ctx.canvas.height/681;
        if (this.text) {
            ctx.fillStyle = 'tan';
            ctx.strokeStyle = 'black';
            ctx.globalAlpha = 0.5;
            ctx.fillRect(scaleX*this.x, scaleY*this.y, scaleX*this.width, scaleY*this.height);
        }
        if (this.source) {
            ctx.globalAlpha = 1;
            ctx.drawImage(this.source, scaleX*this.x, scaleY*this.y, scaleX*this.width, scaleY*this.height);
        }
        if (this.text) {
            ctx.fillStyle = 'white';
            ctx.font = scaleX*20 + "px impact";
            ctx.strokeText(this.text, scaleX*this.x + scaleX*.4*this.width,
                scaleY*(this.y + .8*this.height), scaleX*this.width);
            ctx.fillText(this.text, scaleX*(this.x + .4*this.width),
                scaleY*(this.y + .8*this.height), scaleX*this.width);
        }
    }
}
class GoldText extends GUIElement {
    constructor(x, y, width, size) {
        super(x, y);
        this.width = width;
        this.size = size;
    }
    draw(ctx, gameEngine) {
        let scaleX = ctx.canvas.width/1210;
        let scaleY = ctx.canvas.height/510;
        ctx.fillStyle = 'gold';
        ctx.font = scaleX*this.size + 'px impact';
        ctx.strokeText(inventory.gold, scaleX*this.x, scaleY*this.y, scaleX*this.width);
        ctx.fillText(inventory.gold, scaleX*this.x, scaleY*this.y, scaleX*this.width);
    }
}
class WoodText extends GUIElement {
    constructor(x, y, width, size) {
        super(x, y);
        this.width = width;
        this.size = size;
    }
    draw(ctx, gameEngine) {
        let scaleX = ctx.canvas.width/1210;
        let scaleY = ctx.canvas.height/510;
        ctx.fillStyle = 'gold';
        ctx.font = scaleX*this.size + 'px impact';
        ctx.strokeText(inventory.wood, scaleX*this.x, scaleY*this.y, scaleX*this.width);
        ctx.fillText(inventory.wood, scaleX*this.x, scaleY*this.y, scaleX*this.width);
    }
}
class SheepText extends GUIElement {
    constructor(x, y, width, size) {
        super(x, y);
        this.width = width;
        this.size = size;
    }

    draw(ctx, gameEngine) {
        let scaleX = ctx.canvas.width/1210;
        let scaleY = ctx.canvas.height/510;
        ctx.fillStyle = 'gold';
        ctx.font = scaleX*this.size + 'px impact';
        ctx.strokeText(Barn.sheepRequired - Barn.sheepCount, scaleX*this.x, scaleY*this.y, scaleX*this.width);
        ctx.fillText(Barn.sheepRequired - Barn.sheepCount, scaleX*this.x, scaleY*this.y, scaleX*this.width);
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
        let scaleX = ctx.canvas.width/1210;
        let scaleY = ctx.canvas.height/510;
        ctx.beginPath();
        ctx.globalAlpha = .5;
        ctx.fillStyle = "black";
        ctx.moveTo(scaleX*this.x + scaleX*.5*this.width, scaleX*(this.y + .5*this.height));
        ctx.arc(scaleX*(this.x + .5*this.width), scaleX*(this.y + .5*this.height), scaleX*.5*this.width, 0,2*this.actionTimeElapsed * PI/this.time, true);
        ctx.fill();
     }
}

class MiniMap extends GUIElement {
    constructor(mapElement, centeredOn, zoom = 0.125, zoomMax = 0.5, zoomMin = 0.05) {
        super();
        this.mapElement = mapElement;
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

        this.mapElement.draw(offscreenContext, gameEngine);
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
                        : entity.isDestructible
                            ? "gray"
                            : rgba(0, 0, 0, 0);
            offscreenContext.fillRect(x, y, width, height);
        });

        ctx.beginPath();
        ctx.arc(width - radius - 5, radius + 5, radius, 0, 2 * PI);
        ctx.clip()

        ctx.beginPath();
        ctx.fillStyle = "#294429";
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