class Darkness {
    constructor(ctx,) {
        this.ambientLight = .1;
        this.intensity = 1;
        this.radius = 100;
        this.amb = 'rgba(0,0,0,' + (1-this.ambientLight) + ')';
    }
    
    draw(ctx, gameEngine) {
        // First circle
        var g = ctx.createRadialGradient(200, 200, 0, 200, 200, this.radius);
        g.addColorStop(1, 'rgba(0,0,0,' + (1-this.intensity) + ')');
        g.addColorStop(0, this.amb);
        ctx.fillStyle = g;
        ctx.fillRect(200-this.radius, 200-this.radius, 200+this.radius, 200+this.radius);

        // Second circle
        var g = ctx.createRadialGradient(250, 270, 0, 250, 270, this.radius);
        g.addColorStop(1, 'rgba(0,0,0,' + (1-this.intensity) + ')');
        g.addColorStop(0, this.amb);
        ctx.fillStyle = g;
        ctx.fillRect(250-this.radius, 270-this.radius, 250+this.radius, 270+this.radius);

        // Third!
        var g = ctx.createRadialGradient(50, 370, 0, 50, 370, this.radius);
        g.addColorStop(1, 'rgba(0,0,0,' + (1-this.intensity) + ')');
        g.addColorStop(0, this.amb);
        ctx.fillStyle = g;
        ctx.fillRect(0, 370-this.radius, 50+this.radius, 370+this.radius);

        ctx.fillStyle = this.amb;
        //ctx.globalCompositeOperation = 'xor';
        //ctx.fillRect(0,0,500,500);
    }   
    update() {
        
    }
}