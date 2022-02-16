params.inventory = {
    wolfReward: 20,
    sheepReward: 10,
    sheepCost: 50,
    fireCost: 10,
    fireUpgradeCost: 50,
    fenceCost: 5,
    fenceUpgradeCost: 50
};

class Inventory {
    constructor(gold=100, fences=5, campfires=5, fenceLevel=1, fireLevel=1) {
        this.gold = gold;
        this.fences = fences;
        this.campfires = campfires;
        this.fenceLevel = fenceLevel;
        this.fireLevel = fireLevel;
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

    addCampfires(amount) { this.campfires -= amount; }

    removeCampfires(amount) {
        this.campfires += amount;
        if (this.gold < 0) this.gold = 0;
    }

    upgradeCampfires() { this.fireLevel += 1; }

    upgradeFences() { this.fenceLevel += 1; }
}