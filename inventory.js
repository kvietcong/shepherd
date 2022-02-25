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
    constructor(gold=100, wood = 100, fences=5, campfires=5, fenceLevel=1, fireLevel=1) {
        this.gold = gold;
        this.fences = fences;
        this.campfires = campfires;
        this.fenceLevel = fenceLevel;
        this.fireLevel = fireLevel;
        this.wood = wood;
    }

    get gold() { return this._gold; }
    set gold(newGold) {
        this._gold = newGold;
        if (this._gold < 0) this._gold = 0;
        const goldAmountContainer = document.getElementById("gold-amount");
        goldAmountContainer.textContent = this._gold;
    }

    attemptSpend(amount, type="gold") {
        if (type === "gold") {
            if (this.gold >= amount) {
                this.gold -= amount;
                return true;
            }
            return false;
        } else if (type === "wood") {
            if (this.wood >= amount) {
                this.wood -= amount;
                return true;
            }
            return false;
        }
    }

    addGold(amount) { this.gold += amount; }
    addWood(amount) { this.wood += amount; }
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