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

        //offscreenCanvas.width = width*2;
        //offscreenCanvas.height = height*2;
        let newX =  x ;//- (gameEngine.camera.x - width);
        let newY =  y ;//- (gameEngine.camera.y - height); 
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
        
        //gameEngine.camera.zoom;
        let scale = gameEngine.width/641;
        // Shepherd Light
        this.addLight(width, height, this.radius);
        gameEngine.entities.forEach(entity => {
            if (entity === this) return;
            if (entity instanceof Fire) {
                this.addLight(entity.xCenter - (gameEngine.camera.x - width), entity.yCenter - (gameEngine.camera.y - height), this.radius);
            }
        });
        
        //this.addLight(posX, posY, this.radius);
        //camera.x, y = shepherd pos, width, height = center darkness.
        // Map Light
        //this.addLight(scale*1110, scale*110, scale*110);
        // offscreenContext.translate(
        //     (gameEngine.width / 2 / gameEngine.camera.zoom) - gameEngine.camera.x,
        //     (gameEngine.height / 2 / gameEngine.camera.zoom) - gameEngine.camera.y
        // );
        
        offscreenContext.fillStyle = this.amb;
        offscreenContext.globalCompositeOperation = 'xor';
        offscreenContext.fillRect(0, 0, width*2, height*2);

        ctx.drawImage(offscreenContext.canvas, gameEngine.camera.x - width, gameEngine.camera.y - height);
        console.log(gameEngine.camera.x);
        console.log(gameEngine.camera.y);
        console.log(width);
        console.log(height);
        offscreenContext.restore();

        offscreenContext.clearRect(0, 0, width*2, height*2);
    }   

    update() {
        
    }
}
// Shared Offscreen Canvas to manipulate images with.
Darkness.offscreenCanvas = document.createElement("canvas");
Darkness.offscreenContext = Darkness.offscreenCanvas.getContext("2d");