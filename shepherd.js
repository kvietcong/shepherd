params.shepherd = {
};

const makeShepherdAnimator = () => {
    const size = 64;
    const shepherdAnimations = {
        staticBack: { frameAmount: 1, startX: 0, startY: 8 * size  },
        staticLeft: { frameAmount: 1, startX: 0, startY: 9 * size  },
        staticForward: { frameAmount: 1, startX: 0, startY: 10 * size  },
        staticRight: { frameAmount: 1, startX: 0, startY: 11 * size  },

		walkBack: { frameAmount: 9, startX: 0, startY: size * 8 },
		walkLeft: { frameAmount: 9, startX: 0, startY: size * 9 },
		walkForward: { frameAmount: 9, startX: 0, startY: size * 10 },
		walkRight: { frameAmount: 9, startX: 0, startY: size * 11 },

		spellBack: { frameAmount: 7, startX: 0, startY: size * 0 },
		spellLeft: { frameAmount: 7, startX: 0, startY: size * 1 },
		spellForward: { frameAmount: 7, startX: 0, startY: size * 2 },
		spellRight: { frameAmount: 7, startX: 0, startY: size * 3 },

		pokeBack: { frameAmount: 8, startX: 0, startY: size * 4 },
		pokeLeft: { frameAmount: 8, startX: 0, startY: size * 5 },
		pokeForward: { frameAmount: 8, startX: 0, startY: size * 6 },
		pokeRight: { frameAmount: 8, startX: 0, startY: size * 7 },

		swipeBack: { frameAmount: 6, startX: 0, startY: size * 12 },
		swipeLeft: { frameAmount: 6, startX: 0, startY: size * 13 },
		swipeForward: { frameAmount: 6, startX: 0, startY: size * 14 },
		swipeRight: { frameAmount: 6, startX: 0, startY: size * 15 },

		die: { frameAmount: 6, startX: 0, startY: size * 20 },
	};

    const shepherd = assetManager.getAsset("./resources/shepherd.png");
    return new Animator(
        shepherd, "staticForward", shepherdAnimations, size, size, 1/30
    );
};

class Shepherd extends Entity {
    constructor(x, y, velocity, maxSpeed = 300) {
        super(x, y, 30, 60);
        this.facing = 0; // 0 = back, 1 = left, 2 = forward, 3 = right.
        this.state = 0; // 0 = static, 1 = walking, 2 = spell, 3 = poke, 4 = swipe, 5 = die.
        this.velocity = new Vector(0, 0);
        this.maxSpeed = maxSpeed;
        this.setAnimator(makeShepherdAnimator());
        this.animator.setIsLooping();
        this.animator.play();
    }

    update(gameEngine) {
        super.update(gameEngine);

        this.state = 0;
        this.velocity.x = 0;
        this.velocity.y = 0;

        gameEngine.entities.forEach(entity => {
            if (entity === this) return;
        });

        const {
        } = params.shepherd;

        const {
            w, a, s, d, W, A, S, D, q, e,
            ArrowRight: right, ArrowLeft: left, ArrowUp: up, ArrowDown: down,
            Shift, Control, Z
        } = gameEngine.keys;
        const space = gameEngine.keys[" "];

        if (w) {
            this.velocity.y -= 1;
            this.state = 1;
            this.facing = 0;
        }
        if (a) {
            this.velocity.x -= 1;
            this.state = 1;
            this.facing = 1;
        }
        if (s) {
            this.velocity.y += 1;
            this.state = 1;
            this.facing = 2;
        }
        if (d) {
            this.velocity.x += 1;
            this.state = 1;
            this.facing = 3;
        }

        let isAttacking = false;
        if (space || q || e) {
            if (q) {
                this.state = 2;
                this.animator.tint("cyan")
            }
            if (space) this.state = 3;
            if (e) this.state = 4;
            isAttacking = true;
        }

        // Beyblade moment
        if (Z) this.animator.rotation += 30;

        this.velocity
            .setUnit()
            .scaleInPlace(this.maxSpeed * (isAttacking ? 0.5 : 1));

        // Sprinting
        if (W || A || S || D) {
            this.velocity.scaleInPlace(1.5);
            this.animator.setFPS(60);
        } else this.animator.setFPS(30);


        this.x += this.velocity.x * gameEngine.deltaTime;
        this.y += this.velocity.y * gameEngine.deltaTime;

        // Visual
        const animationList = Object.keys(this.animator.animationInfo);
        this.animator.setAnimation(animationList[this.facing + this.state*4]);
    }

    draw(ctx, gameEngine) {
        super.draw(ctx, gameEngine);

        // Directional Line
        if (params.isDebugging) {
            const debugLine = this.velocity.unit.scale(30);
            ctx.beginPath();
            ctx.moveTo(this.xCenter + debugLine.x, this.yCenter + debugLine.y);
            ctx.lineTo(this.xCenter, this.yCenter);
            ctx.stroke();
        }
    }
}