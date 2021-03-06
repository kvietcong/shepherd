// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;
        this.ctxDark = null;
        // Everything that will be updated and drawn each frame
        this.entities = [];
        // Entities to be added at the end of each update
        this.entitiesToAdd = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        // THE KILL SWITCH
        this.isRunning = false;

        this.isPaused = false;

        // Options and the Details
        this.options = options || {
            prevent: {
                contextMenu: true,
                scrolling: true,
            },
        };
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
    };

    initDark(ctxDark) {
        this.ctxDark = ctxDark;
        this.timerDark = new Timer();
    }

    setCamera(camera) {
        this.camera = camera;
    }

    start() {
        this.isRunning = true;
        const gameLoop = () => {
            this.loop();
            if (this.isRunning) {
                requestAnimFrame(gameLoop, this.ctx.canvas);
            }
        };
        gameLoop();
    };

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });

        this.ctx.canvas.addEventListener("mousemove", e => {
            if (params.isDebugging) console.log("MOUSE_MOVE", getXandY(e));
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (params.isDebugging) console.log("CLICK", getXandY(e));

            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (params.isDebugging)
                console.log("WHEEL", getXandY(e), e.wheelDelta);

            if (this.options.prevent.scrolling) e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (params.isDebugging) console.log("RIGHT_CLICK", getXandY(e));

            if (this.options.prevent.contextMenu) e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        this.ctx.canvas.addEventListener("keydown",  event => {
            event.preventDefault();
            const { key } = event;
            if (params.isDebugging) console.log(event);

            this.keys[key] = true;

            if (key.toLowerCase() === "p") this.isPaused = !this.isPaused;

            // Enable all valid letters when pressing Shift or capital letters
            if (key === "Shift" || (key.length === 1 && isLetters(key) && isUpperCase(key))) {
                for (let i = 0; i < 26; i++) {
                    const lower = String.fromCharCode(i + 97);
                    const upper = lower.toUpperCase();
                    const activation = this.keys[upper] || this.keys[lower];
                    this.keys[upper] = this.keys[lower] = activation;
                }
            }
            if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code) > -1) {
                event.preventDefault();
            }
        });

        this.ctx.canvas.addEventListener("keyup", event => {
            const { key } = event;
            if (params.isDebugging) console.log(event);

            this.keys[key] = false;

            // Disable all capital letters when letting go of Shift
            if (key === "Shift")
                for (let i = 0; i < 26; i++)
                    this.keys[String.fromCharCode(i + 97).toUpperCase()] = false;

            // Ensure that single character keys are disabled when either the
            // capital or non-capital is let go.
            if (key.length === 1 && isLetters(key)) {
                this.keys[key.toLowerCase()] = false;
                this.keys[key.toUpperCase()] = false;
            }
        });

        this.ctx.canvas.addEventListener("mousedown", event => {
            const { button } = event;
            const key = button === 0 ? "click" : button === 1 ? "middle" : "rightclick";
            this.keys[key] = true;
         });
        this.ctx.canvas.addEventListener("mouseup", event => {
            const { button } = event;
            const key = button === 0 ? "click" : button === 1 ? "middle" : "rightclick";
            this.keys[key] = false;
        });

        this.ctx.canvas.addEventListener("focusout", _ => this.keys = {})
    };

    addEntity(entity) {
        this.addEntities([entity]);
    };

    addEntities(entities) {
        this.entitiesToAdd = this.entitiesToAdd.concat(entities);
    };

    drawRelative(entity, func) {
        this.ctx.save();
        if (this.camera && entity.isRelative) {
            this.ctx.translate(
                (this.width / 2 / this.camera.zoom) - this.camera.x,
                (this.height / 2 / this.camera.zoom) - this.camera.y
            );
        }
        func();
        this.ctx.restore();
    }

    drawZoom(entity, func) {
        this.ctx.save();
        if (this.camera && entity.isZoomable) {
            this.ctx.scale(this.camera.zoom, this.camera.zoom);
        }
        func();
        this.ctx.restore();
    }

    drawEffects(entity, func) {
        this.drawZoom(entity, () => this.drawRelative(entity, func));
    }

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw latest things first
        for (let i = this.entities.length - 1; i >= 0; i--) {
            const entity = this.entities[i];
            if (entity.noDraw) continue;
            this.drawEffects(entity, () => entity.draw(this.ctx, this));
        }

        if (this.isPaused) {
            this.ctx.fillStyle = rgba(0, 0, 0, 0.5);
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            const pauseText = "Game Paused";
            const pauseTextWidth = this.ctx.measureText(pauseText).width;
            this.ctx.fillStyle = "red";
            this.ctx.font = "bold 70px VT323, Arial";
            this.ctx.fillText(
                pauseText,
                this.ctx.canvas.width / 2 - pauseTextWidth / 2,
                this.ctx.canvas.height / 2,
                this.ctx.canvas.width
            );
        }
    };

    update() {
        if (this.isPaused) return;

        // Remove dead things
        this.entities = this.entities.filter(entity => !entity.removeFromWorld);

        // Update Entities
        this.entities.forEach(entity => {
            entity.update(this);
        });
        if (this.camera) this.camera.update(this);

        //Maybe use this in the future. To discuss.
        const comparator = (a, b) => {
            if (b.z === undefined && a.z === undefined) return 0;
            if (b.z === undefined) return 1;
            if (a.z === undefined) return -1;
            if (   (a.z !== 0)
                || (b.z !== 0)
                || (!a instanceof Entity)
                || (!b instanceof Entity)
            ) return b.z - a.z;
            return (b.y + b.height) - (a.y + a.height);
        };
        this.entities.sort(comparator);

        // Add new things
        this.entities = this.entities.concat(this.entitiesToAdd);
        this.entitiesToAdd = [];

        // Reset the inputs
        this.rightclick = null;
        this.click = null;
        this.wheel = null;
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

    get deltaTime() { return this.clockTick; }
    get width() { return this.ctx?.canvas?.width || 0; }
    get height() { return this.ctx?.canvas?.height || 0; }
};

// KV Le was here :)