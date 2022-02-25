class Darkness {
    constructor() {
        //the lower the darker.
        this.ambientLight = .01;
        this.radius = 150;
        this.amb = 'rgba(0,0,0,' + (1-this.ambientLight) + ')';
    }
    addLight(x, y, radius, following) {
        var g = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        g.addColorStop(0, this.amb);
        this.ctx.fillStyle = g;
        this.ctx.fillRect(x - radius, y - radius, x + radius, y + radius);
    }
    draw(ctx, gameEngine) {
        let scale = gameEngine.width/1210;
        this.ctx = gameEngine.ctxDark;
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // Shepherd Light
        this.addLight(scale*620, scale*330, scale*this.radius);
        // Map Light
        this.addLight(scale*1110, scale*110, scale*110);

        this.ctx.fillStyle = this.amb;
        this.ctx.globalCompositeOperation = 'xor';
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }   
    update() {
        
    }
}