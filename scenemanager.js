class SceneManager {
            //x= 1210, y = 681.
    constructor() {
        this.scenes = ["title", "level1", "credits", "gameOver"];
        this.currentScene = "";
        this.width = 1210;
        this.height = 681;
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
            0, 0, this.width, this.height
        );
        screen.z = 8;
	    const begin = new Icon(
            assetManager.getAsset("./resources/Play.png"),
            this.width/2 - 150, this.height/2 - 40,
            300, 80
        );
        begin.z = 9;
	    gameEngine.addEntity(screen);
	    gameEngine.addEntity(begin);
    }

    loadLevelOne(gameEngine) {
        const entities = [];

        const shepherd = new Shepherd(1200, 800);
        //const shepherd = new Shepherd(this.width / 2, this.height / 2);
        params.debugEntities.shepherd = shepherd;

        entities.push(shepherd);
        for (let i = 0; i < 25; i++) {
            let x = randomInt(this.width * 2);
            let y = randomInt(this.height * 2);
            if (i % 4 === 0) {
                entities.push(new Wolf(x, y));
            } else {
                entities.push(new Sheep(x, y));
            }
        }

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
        const treeIcon = new Icon(assetManager.getAsset("./resources/pinetree.png")
            , 150, 25, 50, 50, "20");
        const goldIcon = new Icon(assetManager.getAsset("./resources/coin_01.png")
            , 400, 25, 50, 50);
        const goldText = new GoldText(
            450, 65, 85, 40);
        const woodIcon = new Icon(assetManager.getAsset("./resources/logs.png")
            , 550, 25, 50, 50);
        const woodText = new WoodText(600, 65, 85, 40);
        entities.push(fenceIcon);
        entities.push(fireIcon);
        entities.push(treeIcon);
        entities.push(goldIcon);
        entities.push(goldText);
        entities.push(woodIcon);
        entities.push(woodText);

        const miniMap = new MiniMap(mainEnvironment, camera);
        entities.push(miniMap);

        gameEngine.addEntities(entities);
        //gameEngine.addEntity(darkness);
    }

    loadCredits(gameEngine) {
        let screen = new Icon(assetManager.getAsset("./resources/pixel_landscape_1.jpg"),
		0, 0, this.width, this.height);
        screen.z = 8;
	    let end = new Icon(assetManager.getAsset("./resources/level_completed.png"), this.width/2 - 150, this.height/2 - 40, 300, 80);
	    end.z = 9;
        gameEngine.addEntity(screen);
	    gameEngine.addEntity(end);
    }

    loadGameOver(gameEngine) {
        const screen = new Icon(assetManager.getAsset("./resources/pixel_landscape_1.jpg"),
		0, 0, this.width, this.height);
        screen.z = 8;
	    const end = new Icon(assetManager.getAsset("./resources/game_over.png"), this.width/2 - 150, this.height/2 - 160, 300, 80);
        const again = new Icon(assetManager.getAsset("./resources/play_again.png"), this.width/2 - 150, this.height/2 - 40, 300, 80);
        again.z = 9;
        end.z = 9;
        gameEngine.addEntity(screen);
	    gameEngine.addEntity(end);
        gameEngine.addEntity(again);
    }

    update(gameEngine) {
        console.log(gameEngine.width);
        console.log(gameEngine.height);
        let scale = gameEngine.width/1210;
        switch(this.currentScene) {
            case "":
                this.loadTitle(gameEngine);
                this.currentScene = "title";
                break;
            case "title":
                // switch to level1 when start button is clicked
                let click = gameEngine.click;
                if (click && click.x > scale*this.width/2 - 150 && click.x < scale*this.width/2 + 150
                    && click.y > scale*this.height/2 - 40 && click.y < scale*this.height/2 + 40) {
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
                } else if (levelOver()) {
                    this.currentScene = "credits";
                    this.clearEntities(gameEngine);
                    this.loadCredits(gameEngine);
                }
                break;
            case "gameOver":
                let click2 = gameEngine.click;
                if (click2 && click2.x > scale*this.width/2 - 150 && click2.x < scale*this.width/2 + 150
                    && click2.y > scale*this.height/2 - 40 && click2.y < scale*this.height/2 + 40) {
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