class Darkness {
    constructor() {
        //the lower the darker.
        this.ambientLight = .01;
        this.radius = 150;
        this.amb = 'rgba(0,0,0,' + (1-this.ambientLight) + ')';
        this.z = 4;
        this.isZoomable = true;
        this.isRelative = true;
    }
    addLight(x, y, radius, following) {
        //(this.width / 2 / this.camera.zoom) - this.camera.x

        //(this.height / 2 / this.camera.zoom) - this.camera.y
        const { offscreenContext, offscreenCanvas } = Darkness;
        const { width, height } = gameEngine;

        offscreenCanvas.width = width;
        offscreenCanvas.height = height;

        var g = offscreenContext.createRadialGradient(x, y, 0, x, y, radius);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        g.addColorStop(0, this.amb);
        offscreenContext.fillStyle = g;
        offscreenContext.fillRect(x - radius, y - radius, x + radius, y + radius);
    }
    draw(ctx, gameEngine) {
        const { offscreenContext, offscreenCanvas } = Darkness;
        const { width, height } = gameEngine;
        offscreenContext.save();
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
        
        //gameEngine.camera.zoom;
        let scale = gameEngine.width/1210;
        // Shepherd Light
        this.addLight(gameEngine.camera.x, gameEngine.camera.y, this.radius);
        // Map Light
        //this.addLight(scale*1110, scale*110, scale*110);
        // offscreenContext.translate(
        //     (gameEngine.width / 2 / gameEngine.camera.zoom) - gameEngine.camera.x,
        //     (gameEngine.height / 2 / gameEngine.camera.zoom) - gameEngine.camera.y
        // );
        offscreenContext.fillStyle = this.amb;
        offscreenContext.globalCompositeOperation = 'xor';
        offscreenContext.fillRect(0, 0, width, height);

        ctx.drawImage(offscreenContext.canvas, 0, 0);
        offscreenContext.restore();

        offscreenContext.clearRect(0, 0, width, height);
    }   

    update() {
        
    }
}
// Shared Offscreen Canvas to manipulate images with.
Darkness.offscreenCanvas = document.createElement("canvas");
Darkness.offscreenContext = Darkness.offscreenCanvas.getContext("2d");