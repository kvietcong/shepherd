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
    constructor(gold, wood, fences, campfires, fenceLevel=1, fireLevel=1) {
        this.resources = { gold, wood, fences, campfires, };
        this.gold = gold;
        this.fenceLevel = fenceLevel;
        this.fireLevel = fireLevel;
    }

    // Ex: inventory.get("gold"); or inventory.set("wood", 100);
    get(resourceType) { return this.resources[resourceType]; }
    set(resourceType, amount) {
        this.resources[resourceType] = amount;
        if (this.resources[resourceType] < 0) this.resources[resourceType] = 0;

        if (resourceType === "gold") {
            const goldAmountContainer = document.getElementById("gold-amount");
            goldAmountContainer.textContent = this.gold;
        }
    }

    get gold() { return this.resources.gold; }
    set gold(newGold) { this.set("gold", newGold); }

    get wood() { return this.resources.wood; }
    set wood(newWood) { this.set("wood", newWood); }

    attemptSpend(charge, resourceType = "gold", callback = null) {
        const resourceAmount = this.get(resourceType);
        if (resourceAmount >= charge) {
            this.set(resourceType, resourceAmount - charge);
            if (callback) callback(this.resources[resourceType]);
            return true;
        }
        return false;
    }

    upgradeCampfires() { this.fireLevel += 1; }

    upgradeFences() { this.fenceLevel += 1; }
}