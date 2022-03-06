const allLevelNames = ["levelOne", "alpha"];

class SceneManager {
    constructor() {
        this.scenes = ["title", "level1", "credits", "gameOver"];
        this.currentScene = "";
        this.width = 1210;
        this.height = 681;
        this.successfulRuns = 0;
    }

    resetGameEngine(gameEngine) {
        gameEngine.entities.forEach(entity => {
            if (entity === this) return;
            entity.removeFromWorld = true;
        });
        Barn.sheepCount = 0;
        Sheep.count = 0;
    }

    loadTitle(gameEngine) {
        const shopContainer = document.getElementById("shop");
        shopContainer.classList.add("disabled");

        const screen = new Icon(
            assetManager.getAsset("./resources/pixel_landscape_1.jpg"),
            0, 0, this.width, this.height
        );

        const playButton = new ScaledRelativeButton(0.5, 0.4, 0.5, 0.2, "Start Game", 0.08);
        gameEngine.addEntity(playButton);
        playButton.onClick = () => {
            this.resetGameEngine(gameEngine);
            this.loadLevel();
        };

        const instructions = new ScaledRelativeButton(0.5, 0.6, 0.2, 0.1, "Instructions", 0.05);
        gameEngine.addEntity(instructions);
        instructions.onClick = () => {
            const instructionsElement = document.getElementById("instructions");
            instructionsElement.open = true;
            instructionsElement.scrollIntoView({ behavior: "smooth" });
        };

        const settings = new ScaledRelativeButton(0.5, 0.73, 0.2, 0.1, "Settings", 0.2);
        gameEngine.addEntity(settings);
        settings.onClick = () => {
            const settingsElement = document.getElementById("settings");
            settingsElement.open = true;
            settingsElement.scrollIntoView({ behavior: "smooth" });
        };

        const credits = new ScaledRelativeButton(0.5, 0.85, 0.2, 0.1, "Credits", 0.225);
        gameEngine.addEntity(credits);
        credits.onClick = () => {
            const creditsElement = document.getElementById("credits");
            creditsElement.open = true;
            creditsElement.scrollIntoView({ behavior: "smooth" });
        };

	    gameEngine.addEntity(screen);
    }

    loadLevel() {
        this.currentScene = allLevelNames[this.successfulRuns++ % allLevelNames.length];

        const shopContainer = document.getElementById("shop");
        shopContainer.classList.remove("disabled");

        const entities = [];

        const mainEnvironment = setupEnvironment(entities, this.currentScene);

        const volumeSlider = document.getElementById("volume-slider");
        volumeSlider.value = params.volume;
        const backgroundMusic = assetManager.getAsset("./resources/No Worries.mp3");
        backgroundMusic.loop = true;
        volumeSlider.addEventListener("change", event => {
            const newVolume = event.target.value;
            backgroundMusic.volume = newVolume;
            params.volume = newVolume;
            backgroundMusic.play();
        });
        backgroundMusic.volume = volumeSlider.value;
        const autoPlayID = setInterval(() => {
            backgroundMusic.play()
                .then(() => clearInterval(autoPlayID))
                .catch(console.error);
        }, 500);

        const shepherd = entities.filter(entity => entity instanceof Shepherd)[0];
        const camera = new Camera(gameEngine.width / 2, gameEngine.height / 2);
        camera.follow(shepherd);
        gameEngine.setCamera(camera);

        const fenceIcon = new Icon(assetManager.getAsset("./resources/fence_horizontal.png"), 50, 25, 50, 50, params.inventory.fenceCost);
        const fireIcon = new Icon(assetManager.getAsset("./resources/fireicon.png"), 100, 25, 50, 50, params.inventory.fireCost);
        const goldIcon = new Icon(assetManager.getAsset("./resources/coin_01.png"), 400, 25, 50, 50);
        const goldText = new GoldText(450, 50, 85, 40);
        const woodIcon = new Icon(assetManager.getAsset("./resources/logs.png"), 550, 25, 50, 50);
        const woodText = new WoodText(600, 50, 85, 40);
        const sheepIcon = new Icon(assetManager.getAsset("./resources/just1Sheep.png"), 700, 18, 60, 60);
        const sheepText = new SheepText(760, 50, 100, 40);
        const sheepLeftText = new ScaledRelativeText(
            [0.0, 10], [1.0, -10], 0.2, () => `${Sheep.count} Sheep Left`);
        const roundsWonText = new ScaledRelativeText(
            [0.8, -10], [1.0, -10], 0.2, `Rounds Won: ${this.successfulRuns - 1}`);

        entities.push(fenceIcon, fireIcon, goldIcon, goldText, woodIcon, woodText, sheepIcon, sheepText, sheepLeftText, roundsWonText);

        const miniMap = new MiniMap(mainEnvironment, camera);
        entities.push(miniMap);

        if (this.successfulRuns > allLevelNames.length) {
            const darkness = new Darkness();
            entities.push(darkness);
            // Make Darkness Scale With Level
            darkness.radius = max(darkness.radius - this.successfulRuns * 40, 200);
        }

        gameEngine.addEntities(entities);
    }

    loadCredits(gameEngine) {
        const isWinRound = this.successfulRuns === (allLevelNames.length * 2);
        const background = `./resources/pixel_landscape_${isWinRound ? 2 : 1}.jpg`;
        let screen = new Icon(assetManager.getAsset(background), 0, 0, this.width, this.height);
        gameEngine.addEntity(screen);

        const congratsText = isWinRound ? "You Win!" : "Nice Round!";
        const congrats = new ScaledRelativeButton(0.5, 0.4, 0.6, 0.3, congratsText, 0.1, {
            normal: { text: "Gold", background: rgba(0, 0, 0, 0.35), border: rgba(0, 0, 0, 0) },
            hover: { text: "Gold", background: rgba(0, 0, 0, 0.35), border: rgba(0, 0, 0, 0) },
        });
        gameEngine.addEntity(congrats);
        congrats.z = 10;

        const inFreeplay = this.successfulRuns >= (allLevelNames.length * 2);
        const playAgainText = inFreeplay ? "Free Play" : "Next Level";
        const playAgainButton = new ScaledRelativeButton(0.5, 0.7, 0.25, 0.2, playAgainText, 0.1);
        gameEngine.addEntity(playAgainButton);
        playAgainButton.onClick = () => {
            this.resetGameEngine(gameEngine);
            Barn.sheepRequired = min(Barn.sheepRequired + 1, 20);
            inventory.resetWood();
            this.loadLevel();
        };
        playAgainButton.z = 10;
    }

    loadGameOver(gameEngine) {
        const screen = new Icon(
            assetManager.getAsset("./resources/pixel_landscape_1.jpg"),
            0, 0, this.width, this.height);
        gameEngine.addEntity(screen);

        const failure = new ScaledRelativeButton(0.5, 0.4, 0.6, 0.3, "You Lost :(", 0.1, {
            normal: { text: "Red", background: rgba(0, 0, 0, 0.35), border: rgba(0, 0, 0, 0) },
            hover: { text: "Red", background: rgba(0, 0, 0, 0.35), border: rgba(0, 0, 0, 0) },
        });
        gameEngine.addEntity(failure);
        failure.z = 10;

        const playAgainButton = new ScaledRelativeButton(0.5, 0.7, 0.2, 0.15, "Retry Game", 0.1);
        gameEngine.addEntity(playAgainButton);
        playAgainButton.onClick = () => {
            this.resetGameEngine(gameEngine);
            this.successfulRuns--;
            this.loadLevel();
        };
        playAgainButton.z = 10;
    }

    update(gameEngine) {
        switch(this.currentScene) {
            case "title":
                break;
            case "alpha":
            case "levelOne":
            case "levelTwo":
            case "levelThree":
            case "levelFour":
                if (gameOver()) {
                    this.currentScene = "gameOver";
                    this.resetGameEngine(gameEngine);
                    this.loadGameOver(gameEngine);
                } else if (levelWon()) {
                    this.currentScene = "credits";
                    this.resetGameEngine(gameEngine);
                    this.loadCredits(gameEngine);
                }
                break;
            case "gameOver":
                break;
            default:
                this.currentScene = "title";
                this.loadTitle(gameEngine);
                break;
        }
    }

    draw(ctx, gameEngine) {}
}

class SpawnPoint extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.isCollidable = false;
    }

    draw(ctx) {
        if (params.isDebugging) {
            ctx.fillStyle = rgba(100, 100, 255, 0.2);
            ctx.fillRect(this.x, this.y, this.width, this.height);

            ctx.strokeStyle = "cyan";
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    /**
     * @param {Class} entity Class of entity to spawn
     * @param {Number} amount Number of objects of the given class to spawn
     * @param {Object} gameEngine Game engine to use
     */
    spawnEntity(entity, amount, gameEngine) {
        if (!(entity.prototype instanceof Entity)) return;

        for (let i = 0; i < amount; i++) {
            let randX = this.x + randomInt(this.width);
            let randY = this.y + randomInt(this.height);
            gameEngine.addEntity(new entity(randX, randY));
        }
    }

    addToList(entities, entity, amount) {
        for (let i = 0; i < amount; i++) {
            let randX = this.x + randomInt(this.width);
            let randY = this.y + randomInt(this.height);
            entities.push(new entity(randX, randY));
        }
    }
}