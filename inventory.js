params.inventory = {
    wolfReward: 20,
    sheepReward: 10,
    sheepCost: 50,
    torchCost: 10,
    torchUpgradeCost: 50,
    fenceCost: 5,
    fenceUpgradeCost: 50
};

class Inventory {
    constructor(gold=100, fences=5, torches=5, fenceLevel=1, torchLevel=1) {
        this.gold = gold;
        this.fences = fences;
        this.torches = torches;
        this.fenceLevel = fenceLevel;
        this.torchLevel = torchLevel;
    }

    addGold(amount) { this.gold += amount; }

    removeGold(amount) {
        this.gold -= amount;
        if (this.gold < 0) this.gold = 0;
    }

    addFences(amount) { this.fences -= amount; }

    removeFences(amount) {
        this.fences += amount;
        if (this.gold < 0) this.gold = 0;
    }

    addTorches(amount) { this.torches -= amount; }

    removeTorches(amount) {
        this.torches += amount;
        if (this.gold < 0) this.gold = 0;
    }

    upgradeTorches() { this.torchLevel += 1; }

    upgradeFences() { this.fenceLevel += 1; }
}