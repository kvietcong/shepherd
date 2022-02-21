class SceneManager {
    constructor() {
        this.scenes = ["title", "level1", "credits", "gameOver"];
        this.currentScene = "";
    }

    clearEntities(gameEngine) {
        gameEngine.entities.forEach(entity => {
            if (entity === this) return;
            entity.removeFromWorld = true;
        });
    }

    loadTitle(gameEngine) {
        const screen = new Icon(
            assetManager.getAsset("./resources/pixel_landscape_1.jpg"),
            0, 0, canvas.width, canvas.height
        );
        screen.z = 8;
	    const begin = new Icon(
            assetManager.getAsset("./resources/Play.png"),
            canvas.width/2 - 150, canvas.height/2 - 40,
            300, 80
        );
        begin.z = 9;
	    gameEngine.addEntity(screen);
	    gameEngine.addEntity(begin);
    }

    loadLevelOne(gameEngine) {
        const entities = [];

        //spawn points:
        //starting area: 1200, 1200
        //main area: 4400, 1200
        //east of bridge: 4000, 2300
        const shepherd = new Shepherd(1200, 1200);
        //const shepherd = new Shepherd(canvas.width / 2, canvas.height / 2);
        params.debugEntities.shepherd = shepherd;
        entities.push(shepherd);

        const startingArea = new SpawnPoint(1200, 650, 900, 750);
        startingArea.spawnSheep(20, gameEngine);

        const wolfPacks = [
            [new SpawnPoint(1830, 1830, 330, 200), 2],
            [new SpawnPoint(2650, 2230, 500, 300), 4],
            [new SpawnPoint(3850, 950, 650, 1650), 6],
            [new SpawnPoint(5350, 1960, 650, 250), 3]
        ];
        wolfPacks.forEach((info) => {
            const [spawnPoint, amount] = info;
            spawnPoint.spawnWolves(amount, gameEngine);
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
            450, 65, 85, 40);
        const woodIcon = new Icon(assetManager.getAsset("./resources/logs.png")
            , 550, 25, 50, 50);
        const woodText = new WoodText(600, 65, 85, 40);
        const sheepIcon = new Icon(assetManager.getAsset("./resources/just1Sheep.png"), 700, 18, 60, 60);
        const sheepText = new SheepText(760, 65, 85, 40);
        entities.push(fenceIcon);
        entities.push(fireIcon);
        //entities.push(treeIcon);
        entities.push(goldIcon);
        entities.push(goldText);
        entities.push(woodIcon);
        entities.push(woodText);
        entities.push(sheepIcon);
        entities.push(sheepText);

        const miniMap = new MiniMap(mainEnvironment, camera);
        entities.push(miniMap);

        gameEngine.addEntities(entities);
        //gameEngine.addEntity(darkness);
    }

    loadCredits(gameEngine) {
        let screen = new Icon(assetManager.getAsset("./resources/pixel_landscape_1.jpg"),
		0, 0, canvas.width, canvas.height);
        screen.z = 8;
	    let end = new Icon(assetManager.getAsset("./resources/level_completed.png"), canvas.width/2 - 150, canvas.height/2 - 40, 300, 80);
	    end.z = 9;
        gameEngine.addEntity(screen);
	    gameEngine.addEntity(end);
    }

    loadGameOver(gameEngine) {
        const screen = new Icon(assetManager.getAsset("./resources/pixel_landscape_1.jpg"),
		0, 0, canvas.width, canvas.height);
        screen.z = 8;
	    const end = new Icon(assetManager.getAsset("./resources/game_over.png"), canvas.width/2 - 150, canvas.height/2 - 160, 300, 80);
        const again = new Icon(assetManager.getAsset("./resources/play_again.png"), canvas.width/2 - 150, canvas.height/2 - 40, 300, 80);
        again.z = 9;
        end.z = 9;
        gameEngine.addEntity(screen);
	    gameEngine.addEntity(end);
        gameEngine.addEntity(again);
    }

    update(gameEngine) {
        switch(this.currentScene) {
            case "":
                this.currentScene = "title";
                this.loadTitle(gameEngine);
                break;
            case "title":
                // switch to level1 when start button is clicked
                let click = gameEngine.click;
                if (click && click.x > canvas.width/2 - 150 && click.x < canvas.width/2 + 150
                    && click.y > canvas.height/2 - 40 && click.y < canvas.height/2 + 40) {
                    this.currentScene = "level1";
                    this.clearEntities(gameEngine);
                    this.loadLevelOne(gameEngine);
                    //this.loadLevel(this.currentScene);
                }
                break;
            case "level1":
                if (gameOver()) {
                    this.currentScene = "gameOver";
                    this.clearEntities(gameEngine);
                    this.loadGameOver(gameEngine);
                } else if (levelWon()) {
                    this.currentScene = "credits";
                    this.clearEntities(gameEngine);
                    this.loadCredits(gameEngine);
                }
                break;
            case "gameOver":
                let click2 = gameEngine.click;
                if (click2 && click2.x > canvas.width/2 - 150 && click2.x < canvas.width/2 + 150
                    && click2.y > canvas.height/2 - 40 && click2.y < canvas.height/2 + 40) {
                    this.currentScene = "level1";
                    this.clearEntities(gameEngine);
                    this.loadLevelOne(gameEngine);
                    //this.loadLevel(this.currentScene);
                }
                break;
        }
    }

    draw(ctx, gameEngine) {}
}

class SpawnPoint {

    // TODO: make a modular spawn function

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    spawnSheep(amount, gameEngine) {
        for (let i = 0; i < amount; i++) {
            let randX = this.x + randomInt(this.w);
            let randY = this.y + randomInt(this.h);
            gameEngine.addEntity(new Sheep(randX, randY));
        }
    }

    spawnWolves(amount, gameEngine) {
        for (let i = 0; i < amount; i++) {
            let randX = this.x + randomInt(this.w);
            let randY = this.y + randomInt(this.h);
            gameEngine.addEntity(new Wolf(randX, randY));
        }
    }
}