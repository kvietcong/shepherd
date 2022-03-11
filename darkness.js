class Darkness {
    constructor() {
        //the lower the darker.
        this.ambientLight = .01;
        this.radius = 600;
        this.amb = 'rgba(0,0,0,' + (1-this.ambientLight) + ')';
        this.z = 4;
        this.isZoomable = true;
        this.isRelative = true;
    }
    addLight(x, y, radius, following) {
        const { offscreenContext } = Darkness;

        let newX =  x;
        let newY =  y;
        var g = offscreenContext.createRadialGradient(newX, newY, 0, newX, newY, radius);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        g.addColorStop(0, this.amb);
        offscreenContext.fillStyle = g;
        offscreenContext.fillRect(newX - radius, newY - radius, newX + radius, newY + radius);
    }
    draw(ctx, gameEngine) {
        const { offscreenContext, offscreenCanvas } = Darkness;
        const { width, height } = gameEngine;
        offscreenContext.save();
        offscreenCanvas.width = width*2;
        offscreenCanvas.height = height*2;

        // Shepherd Light
        this.addLight(width, height, this.radius);
        gameEngine.entities.forEach(entity => {
            if (entity === this) return;
            if (entity instanceof Fire) {
                this.addLight(entity.xCenter - (gameEngine.camera.x - width), entity.yCenter - (gameEngine.camera.y - height), this.radius);
            }
            if (entity instanceof Torch) {
                this.addLight(entity.xCenter - (gameEngine.camer.x - width), entity.yCenter - (gameEngine.camera.y - height), this.radius/2);
            }
        });

        offscreenContext.fillStyle = this.amb;
        offscreenContext.globalCompositeOperation = 'xor';
        offscreenContext.fillRect(0, 0, width*2, height*2);

        ctx.drawImage(offscreenContext.canvas, gameEngine.camera.x - width, gameEngine.camera.y - height);
        offscreenContext.restore();

        offscreenContext.clearRect(0, 0, width*2, height*2);
    }

    update() {

    }
}
// Shared Offscreen Canvas to manipulate images with.
Darkness.offscreenCanvas = document.createElement("canvas");
Darkness.offscreenContext = Darkness.offscreenCanvas.getContext("2d");