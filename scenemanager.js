class SceneManager {
            //x= 1210, y = 681.
    constructor() {
        this.scenes = ["title", "level1", "credits", "gameOver"];
        this.currentScene = "";
        this.width = 1210;
        this.height = 681;
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
        shopContainer.children[0].classList.add("disabled");

        const screen = new Icon(
            assetManager.getAsset("./resources/pixel_landscape_1.jpg"),
            0, 0, this.width, this.height
        );

        const playButton = new ScaledRelativeButton(0.5, 0.4, 0.5, 0.2, "Play Game", 100);
        gameEngine.addEntity(playButton);
        playButton.onClick = () => {
            this.currentScene = "level1";
            this.resetGameEngine(gameEngine);
            this.loadLevelOne(gameEngine);
        };

        const instructions = new ScaledRelativeButton(0.5, 0.6, 0.2, 0.1, "Instructions", 20);
        gameEngine.addEntity(instructions);
        instructions.onClick = () => {
            const instructionsElement = document.getElementById("instructions");
            instructionsElement.open = true;
            instructionsElement.scrollIntoView({ behavior: "smooth" });
        };

        const settings = new ScaledRelativeButton(0.5, 0.73, 0.1, 0.08, "Settings", 20);
        gameEngine.addEntity(settings);
        settings.onClick = () => {
            const settingsElement = document.getElementById("settings");
            settingsElement.open = true;
            settingsElement.scrollIntoView({ behavior: "smooth" });
        };

	    gameEngine.addEntity(screen);
    }

    loadLevelOne(gameEngine) {
        const shopContainer = document.getElementById("shop");
        shopContainer.children[0].classList.remove("disabled");

        const entities = [];

        //Alpha: 1200, 1200
        //LevelOne: 1000, 2200
        const shepherd = new Shepherd(1000, 2200);
        //const shepherd = new Shepherd(this.width / 2, this.height / 2);
        params.debugEntities.shepherd = shepherd;
        entities.push(shepherd);

        const startingArea = new SpawnPoint(1200, 650, 900, 750);
        startingArea.spawnEntity(Sheep, 20, gameEngine);

        const wolfPacks = [
            [new SpawnPoint(1830, 1830, 330, 200), 2], // rocks by first path
            [new SpawnPoint(2650, 2230, 500, 300), 4], // bridge over water
            [new SpawnPoint(3850, 950, 650, 1650), 6], // big open area after bridge
            [new SpawnPoint(5350, 1960, 650, 250), 3]  // small area by barn
        ];
        wolfPacks.forEach((info) => {
            const [spawnPoint, amount] = info;
            spawnPoint.spawnEntity(Wolf, amount, gameEngine);
        });
        const mainEnvironment = setupEnvironment(entities);
        gameEngine.addEntity(sceneManager);

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

        const camera = new Camera(gameEngine.width / 2, gameEngine.height / 2);
        camera.follow(shepherd);
        gameEngine.setCamera(camera);

        const fenceIcon = new Icon(assetManager.getAsset("./resources/fence_horizontal.png")
            , 50, 25, 50, 50, params.inventory.fenceCost);
        const fireIcon = new Icon(assetManager.getAsset("./resources/fireicon.png")
            , 100, 25, 50, 50, params.inventory.fireCost);
        // const treeIcon = new Icon(assetManager.getAsset("./resources/pinetree.png")
        //     , 150, 25, 50, 50, "20");
        const goldIcon = new Icon(assetManager.getAsset("./resources/coin_01.png")
            , 400, 25, 50, 50);
        const goldText = new GoldText(
            450, 50, 85, 40);
        const woodIcon = new Icon(assetManager.getAsset("./resources/logs.png")
            , 550, 25, 50, 50);
        const woodText = new WoodText(600, 50, 85, 40);
        const sheepIcon = new Icon(assetManager.getAsset("./resources/just1Sheep.png"), 700, 18, 60, 60);
        const sheepText = new SheepText(760, 50, 100, 40);
        const sheepLeftText = new ScaledRelativeText(
            [0.0, 10], [1.0, -10], 0.2, () => `${Sheep.count} Sheep Left`);

        entities.push(fenceIcon);
        entities.push(fireIcon);
        //entities.push(treeIcon);
        entities.push(goldIcon);
        entities.push(goldText);
        entities.push(woodIcon);
        entities.push(woodText);
        entities.push(sheepIcon);
        entities.push(sheepText);
        entities.push(sheepLeftText)

        const miniMap = new MiniMap(mainEnvironment, camera);
        entities.push(miniMap);

        gameEngine.addEntities(entities);
        //gameEngine.addEntity(darkness);
    }

    loadCredits(gameEngine) {
        let screen = new Icon(assetManager.getAsset("./resources/pixel_landscape_1.jpg"), 0, 0, this.width, this.height);
        gameEngine.addEntity(screen);

        const congrats = new ScaledRelativeButton(0.5, 0.4, 0.6, 0.3, "You Win!", 50, {
            normal: { text: "Gold", background: rgba(0, 0, 0, 0.35), border: rgba(0, 0, 0, 0) },
            hover: { text: "Gold", background: rgba(0, 0, 0, 0.35), border: rgba(0, 0, 0, 0) },
        });
        gameEngine.addEntity(congrats);
        congrats.z = 10;

        const playAgainButton = new ScaledRelativeButton(0.5, 0.7, 0.2, 0.15, "Play Again", 20);
        gameEngine.addEntity(playAgainButton);
        playAgainButton.onClick = () => {
            this.currentScene = "level1";
            this.resetGameEngine(gameEngine);
            this.loadLevelOne(gameEngine);
            Barn.sheepRequired = min(Barn.sheepRequired + 1, 20);
        };
        playAgainButton.z = 10;
    }

    loadGameOver(gameEngine) {
        const screen = new Icon(
            assetManager.getAsset("./resources/pixel_landscape_1.jpg"),
            0, 0, this.width, this.height);
        gameEngine.addEntity(screen);

        const failure = new ScaledRelativeButton(0.5, 0.4, 0.6, 0.3, "You Lost 😔", 50, {
            normal: { text: "Red", background: rgba(0, 0, 0, 0.35), border: rgba(0, 0, 0, 0) },
            hover: { text: "Red", background: rgba(0, 0, 0, 0.35), border: rgba(0, 0, 0, 0) },
        });
        gameEngine.addEntity(failure);
        failure.z = 10;

        const playAgainButton = new ScaledRelativeButton(0.5, 0.7, 0.2, 0.15, "Play Again", 20);
        gameEngine.addEntity(playAgainButton);
        playAgainButton.onClick = () => {
            // TODO Fix Duplicating Sheep and Probably Wolves!
            Barn.sheepCount = 0;
            this.currentScene = "level1";
            this.resetGameEngine(gameEngine);
            this.loadLevelOne(gameEngine);
        };
        playAgainButton.z = 10;
    }

    update(gameEngine) {
        switch(this.currentScene) {
            case "title":
                break;
            case "level1":
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

class SpawnPoint {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    /**
     * @param {Class} entity Class of entity to spawn
     * @param {Number} amount Number of objects of the given class to spawn
     * @param {Object} gameEngine Game engine to use
     */
    spawnEntity(entity, amount, gameEngine) {
        if (!(entity.prototype instanceof Entity)) return;

        for (let i = 0; i < amount; i++) {
            let randX = this.x + randomInt(this.w);
            let randY = this.y + randomInt(this.h);
            gameEngine.addEntity(new entity(randX, randY));
        }
    }
}