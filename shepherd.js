params.shepherd = {
    energyLossRate: 20,
    energyRegenRate: 10,
    fenceCooldown: 2,
    attackCooldown: 0.7
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
        this.actionTimeElapsed = {fence1: 2, action2: 1, action3: 4, attack: 0.4};
        this.time = 0;
        this.setAnimator(makeShepherdAnimator());
        this.animator.setIsLooping();
        this.animator.play();

        this.timeSinceLostEnergy = 0;
        this.maxEnergy = 100;
        this.energy = 100;
    }

    update(gameEngine) {
        super.update(gameEngine);

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
        const one = gameEngine.keys["1"];
        const two = gameEngine.keys["2"];
        const three = gameEngine.keys["3"];
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
        if (space || one || q) {
            if (one) {
                this.state = 2;
                this.animator.tint("cyan")
            }
            if (space) this.state = 4;
            if (q) this.state = 3;
            isAttacking = true;
        }
        gameEngine.entities.forEach(entity => {
            if (entity === this) return;
            if (this.collidesWith(entity)) {
                if (entity.isCollidable) {
                    if (entity instanceof Sheep) return;
                    if (this.y - 10 > entity.y - this.height && this.y + 10 < entity.y + entity.height) {
                        if (this.x < entity.x) this.x = entity.x - this.width;
                        if(this.x > entity.x) this.x = entity.x + entity.width;
                    } if (this.x > entity.x - this.width && this.x < entity.x + entity.width) {
                        if (this.y < entity.y) this.y = entity.y - this.height;
                        if (this.y > entity.y) this.y = entity.y + entity.height;
                    }
                } else if (isAttacking && entity instanceof Wolf) {
                    if (entity.health > 0) {
                        entity.health--;
                    } else {
                        entity.removeFromWorld = true;
                    }
                    entity.x += 20*this.velocity.x;
                    entity.y += 20*this.velocity.y;
                    entity.velocity.x = 0;
                    entity.velocity.y = 0;
                }
            }

        });
        // shepherd takes actions.
        //this.actionTimeElapsed += gameEngine.deltaTime;
        Object.keys(this.actionTimeElapsed).forEach(key => {
            this.actionTimeElapsed[key] += gameEngine.deltaTime;
        });
        if (one) {
            if (this.actionTimeElapsed.fence1 >= params.shepherd.fenceCooldown) {
                if (this.facing == 0) gameEngine.addEntity(new Obstacle(this.x - 25, this.y - 60, "./resources/fence_vertical.png", 15, 50, 20, 63, 1));
                if (this.facing == 1) gameEngine.addEntity(new Obstacle(this.x - 40, this.y - 30, "./resources/fence_horizontal.png", 50, 15, 46, 32, 1));
                if (this.facing == 2) gameEngine.addEntity(new Obstacle(this.x - 25, this.y + 10, "./resources/fence_vertical.png", 15, 50, 20, 63, 1));
                if (this.facing == 3) gameEngine.addEntity(new Obstacle(this.x + 10, this.y - 30, "./resources/fence_horizontal.png", 50, 15, 46, 32, 1));
                gameEngine.addEntity(new CooldownTimer(50, 50, 50, 50, params.shepherd.fenceCooldown));
                this.actionTimeElapsed.fence1 = 0;
            }
        }
        if (two) {
            if (this.actionTimeElapsed.action2 >= 1) {
                gameEngine.addEntity(new Obstacle(this.x, this.y, "./resources/fireicon.png", 50, 50, 33, 38, 2));
                gameEngine.addEntity(new CooldownTimer(100, 50, 50, 50, 1));
                this.actionTimeElapsed.action2 = 0;
            }
        }
        if (three) {
            if (this.actionTimeElapsed.action3 >= 4) {
                gameEngine.addEntity(new Obstacle(this.x, this.y, "./resources/pinetree.png", 40, 50, 50, 82, 1.8));
                gameEngine.addEntity(new CooldownTimer(150, 50, 50, 50, 4));
                this.actionTimeElapsed.action3 = 0;
            }
        }
        if (space && !q) {
            if (this.actionTimeElapsed.attack >= params.shepherd.attackCooldown) {
                //x - 40, y - 30, left; x + 10, y - 30, right; x - 10, y + 10, down; x - 10, y - 60, up.
                if (this.facing == 0) gameEngine.addEntity(new Attack(this.x - 10, this.y - 60, 3, new Vector(0, -100)));
                if (this.facing == 1) gameEngine.addEntity(new Attack(this.x - 40, this.y - 30, 2, new Vector(-100, 0)));
                if (this.facing == 2) gameEngine.addEntity(new Attack(this.x - 10, this.y + 10, 1, new Vector(0, 100)));
                if (this.facing == 3) gameEngine.addEntity(new Attack(this.x + 10, this.y - 30, 0, new Vector(100, 0)));
                this.actionTimeElapsed.attack = 0;
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

class CooldownTimer extends GUIElement {
    constructor(x, y, width, height, time) {
        super(x, y, width, height);
        this.width = width;
        this.height = height;
        this.actionTimeElapsed = 0;
        this.time = time;
        this.z = 0;
    }
    update(gameEngine) {
        this.actionTimeElapsed += gameEngine.deltaTime;
        if (this.actionTimeElapsed > this.time) this.removeFromWorld = true;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.globalAlpha = .8;
        ctx.fillStyle = "black";
        ctx.moveTo(this.x + .5*this.width, this.y + .5*this.height);
        ctx.arc(this.x + .5*this.width, this.y + .5*this.height, .5*this.width, 0,2*this.actionTimeElapsed * PI/this.time, true);
        ctx.fill();
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
        attack, "right", attackAnimations, 110, 130, 1/20, 1/2
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
        this.entitiesToIgnore = new Set();
    }

    update(gameEngine) {
        this.time += gameEngine.deltaTime;

        super.update(gameEngine);
        if (this.time > .3) this.removeFromWorld = true;

        this.animator.tint("black");
        gameEngine.entities.forEach(entity => {
            if (entity === this) return;
            if (this.collidesWith(entity)) {
                if (entity instanceof Wolf && !this.entitiesToIgnore.has(entity)) {
                    entity.attacked(this.damage);
                    entity.x += 1;
                    entity.y += 1;
                    entity.velocity.x = 0;
                    entity.velocity.y = 0;
                    this.entitiesToIgnore.add(entity);
                }
                if (entity instanceof Obstacle) {
                    entity.removeFromWorld = true;
                }
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