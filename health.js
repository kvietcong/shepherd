class HealthAPI {
    constructor(
        health = 100, maxHealth = 100,
        fadeTime = 2,
        alwaysShowWhenDamaged = false,
        cancelHealOnFull = true
    ) {
        this._health; this.health = health;
        this._maxHealth = maxHealth;

        this.alwaysShowWhenDamaged = alwaysShowWhenDamaged;
        this.cancelHealOnFull = cancelHealOnFull;

        this.fadeTime = fadeTime;
        this.timeSinceLastChanged = fadeTime;
    }

    get health() { return this._health; }
    set health(health) {
        if (health > this.maxHealth) {
            health = this.maxHealth;
            if (this.cancelHealOnFull) this.healInfo = null;
        } else if (health < 0) {
            health = 0;
            this.damageInfo = null;
        }

        if (health === this._health) return;

        this._health = health;
        this.timeSinceLastChanged = 0;
    }

    get maxHealth() { return this._maxHealth; }
    set maxHealth(maxHealth) {
        this._maxHealth = maxHealth < 0 ? 100 : maxHealth;
    }

    get isMaxed() { return this.health === this.maxHealth; }

    heal(amount, time) {
        if (time) this.healInfo = { amount, time };
        else this.health += amount;
    }

    damage(amount, time) {
        if (time) this.damageInfo = { amount, time };
        else this.health -= amount;
    }

    attachShortcutsTo(entity) {
        entity.healthAPI = this;
        entity.heal = (amount, time) => this.heal(amount, time);
        entity.damage = (amount, time) => this.damage(amount, time);
        return this;
    }

    update(gameEngine) {
        const { deltaTime } = gameEngine;
        this.timeSinceLastChanged += deltaTime;

        if (this.healInfo) {
            this.healInfo.time -= deltaTime;
            const { amount } = this.healInfo;
            this.health += amount * deltaTime;
            if (this.healInfo?.time <= 0) this.healInfo = null;
        }

        if (this.damageInfo) {
            this.damageInfo.time -= deltaTime;
            const { amount } = this.damageInfo;
            this.health -= amount * deltaTime;
            if (this.damageInfo?.time <= 0) this.damageInfo = null;
        }
    }

    draw(x, y, width, height, ctx, gameEngine) {
        if (this.alwaysShowWhenDamaged && !this.isMaxed) {}
        else if (this.timeSinceLastChanged > this.fadeTime) return;

        const ratio = this.health / this.maxHealth;

        const xDraw = x - width / 2;
        const yDraw = y - height;

        ctx.save();
        ctx.fillStyle = "red";
        ctx.fillRect(xDraw, yDraw, width, height);
        ctx.fillStyle = "green";
        ctx.fillRect(xDraw, yDraw, width * ratio, height);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(xDraw, yDraw, width, height);
        ctx.restore();
    }
}