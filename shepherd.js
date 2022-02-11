params.shepherd = {
    energyLossRate: 20,
    energyRegenRate: 10,
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
        super(x, y, 30, 20);
        this.facing = 0; // 0 = back, 1 = left, 2 = forward, 3 = right.
        this.state = 0; // 0 = static, 1 = walking, 2 = spell, 3 = poke, 4 = swipe, 5 = die.
        this.velocity = new Vector(0, 0);
        this.maxSpeed = maxSpeed;

        // shepherds's fire state variables
        this.actionTimeElapsed = 0;
        this.time = 0;
        this.setAnimator(makeShepherdAnimator());
        this.animator.setIsLooping();
        this.animator.play();

        this.timeSinceLostEnergy = 0;
        this.maxEnergy = 100;
        this.energy = 100;

        this.healthAPI = new HealthAPI(
            100, 100, 1.5, true, true
        ).attachShortcutsTo(this);
    }

    update(gameEngine) {
        super.update(gameEngine);
        this.healthAPI.update(gameEngine);

        this.z = 0;
        if (this.time < 25) {
            this.time++;
        } else {
            this.time = 0;
            this.state = 0
        }
        this.velocity.x = 0;
        this.velocity.y = 0;


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
        gameEngine.entities.forEach(entity => {
            if (entity === this) return;
            if (this.collidesWith(entity)) {
                if (entity.isCollidable) {
                    if (entity instanceof Sheep) return;
                    //this.animator.tint("red");
                    this.x += -10*this.velocity.x;
                    this.y += -10*this.velocity.y;
                } else if (isAttacking && entity instanceof Wolf) {
                    entity.animator.tint("red");
                    if (entity.health > 0) {
                        entity.health--;
                    } else {
                        entity.dead = 1;
                    }
                    entity.x += 20*this.velocity.x;
                    entity.y += 20*this.velocity.y;
                    entity.velocity.x = 0;
                    entity.velocity.y = 0;
                }
            }

        });
        // shepherd takes actions.
        this.actionTimeElapsed += gameEngine.deltaTime;
        if (space) {
            if (this.actionTimeElapsed >= 0.2) {
                if (this.facing == 0) gameEngine.addEntity(new Fence(this.x - 10, this.y - 60, 1));
                if (this.facing == 1) gameEngine.addEntity(new Fence(this.x - 40, this.y - 30, 0));
                if (this.facing == 2) gameEngine.addEntity(new Fence(this.x - 10, this.y + 10, 1));
                if (this.facing == 3) gameEngine.addEntity(new Fence(this.x + 10, this.y - 30, 0));
                this.actionTimeElapsed = 0;
            }
        }
        if (e) {
            if (this.actionTimeElapsed >= 0.2) {
                //x - 40, y - 30, left; x + 10, y - 30, right; x - 10, y + 10, down; x - 10, y - 60, up.
                if (this.facing == 0) gameEngine.addEntity(new Attack(this.x - 10, this.y - 60, 3, new Vector(0, -100)));
                if (this.facing == 1) gameEngine.addEntity(new Attack(this.x - 40, this.y - 30, 2, new Vector(-100, 0)));
                if (this.facing == 2) gameEngine.addEntity(new Attack(this.x - 10, this.y + 10, 1, new Vector(0, 100)));
                if (this.facing == 3) gameEngine.addEntity(new Attack(this.x + 10, this.y - 30, 0, new Vector(100, 0)));
                //gameEngine.addEntity(new Attack(this.x - 10, this.y - 60, 3 - this.facing));
                this.actionTimeElapsed = 0;
            }
        }
        // Beyblade moment
        if (Z) this.animator.rotation += 30;

        this.velocity
            .setUnit()
            .scaleInPlace(this.maxSpeed * (isAttacking ? 0.5 : 1));

        // Sprinting
        this.timeSinceLostEnergy += gameEngine.deltaTime;
        if ((W || A || S || D) && this.timeSinceLostEnergy >= 2) {
            if (this.energy > 0) {
                this.velocity.scaleInPlace(1.75);
                this.animator.setFPS(75);
                this.energy -= params.shepherd.energyLossRate * gameEngine.deltaTime;
                this.energy = max(0, this.energy);
            } else {
                this.timeSinceLostEnergy = 0;
            }
        } else {
            this.energy += params.shepherd.energyRegenRate * gameEngine.deltaTime;
            this.energy = min(this.maxEnergy, this.energy);
            this.animator.setFPS(30);
        }


        this.x += this.velocity.x * gameEngine.deltaTime;
        this.y += this.velocity.y * gameEngine.deltaTime;

        // Visual
        const animationList = Object.keys(this.animator.animationInfo);
        this.animator.setAnimation(animationList[this.facing + this.state*4]);
    }

    heal(amount, time) { this.healthAPI.heal(amount, time); }
    damage(amount, time) { this.healthAPI.damage(amount, time); }

    draw(ctx, gameEngine) {
        super.draw(ctx, gameEngine);
        this.healthAPI.draw(
            this.xCenter, this.y - 35,
            75, 15,
            ctx, gameEngine);

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
const makeFenceAnimator = () => {
    const size = 140;
    const fenceAnimations = {
        horizontal: {frameAmount: 1, startX: 8, startY: 16},
        vertical: {frameAmount: 1, startX: 34, startY: 0}
    }
    const fence = assetManager.getAsset("./resources/fence_00.png");
    return new Animator(
        fence, "horizontal", fenceAnimations, 26, 33, 1, 2
    )
}
class Fence extends Obstacle {
    constructor(x, y, direction) {
        if (direction) {
            super(x, y, null, 20, 60); //vertical
        } else {
            super(x, y, null, 60, -10); //horizontal
        }
        this.setAnimator(makeFenceAnimator());
        const animationList = Object.keys(this.animator.animationInfo);
        this.animator.setAnimation(animationList[direction]);

        this.animator.setIsLooping();
        this.animator.play();
    }
}

const makeAttackAnimator = () => {
    const size = 140;
    const frameAmount = 4;
    const attackAnimations = {
        right: {frameAmount, startX: 0, startY: 0}
    }
    const attack = assetManager.getAsset("./resources/slash.png");
    return new Animator(
        attack, "right", attackAnimations, 110, 130, 1/15, 1/2
    )
}

class Attack extends Entity {
    constructor(x, y, direction, velocity, maxSpeed = 100) {
        super(x, y, 60, 60);
        this.velocity = velocity;
        this.maxSpeed = maxSpeed;
        this.time = 0;
        this.setAnimator(makeAttackAnimator());
        this.animator.setIsLooping();
        this.animator.play();
        this.animator.rotation += 90*direction;
        this.time = 0;
        this.isCollidable = false;
        this.damage = 25;
    }

    update(gameEngine) {
        this.time += gameEngine.deltaTime;

        super.update(gameEngine);
        if (this.time > .3) this.removeFromWorld = true;

        this.animator.tint("black");
        gameEngine.entities.forEach(entity => {
            if (entity === this) return;
            if (this.collidesWith(entity) && entity instanceof Wolf) {
                entity.attacked(this.damage);
                entity.x += 1;
                entity.y += 1;
                entity.velocity.x = 0;
                entity.velocity.y = 0;
            }
        });
        this.x += this.velocity.x * gameEngine.deltaTime;
        this.y += this.velocity.y * gameEngine.deltaTime;

        const animationList = Object.keys(this.animator.animationInfo);
        this.animator.setAnimation(animationList[0]);
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