class SceneManager extends Entity {
    constructor() {
        super(0, 0, 0, 0);
        this.isCollidable = false;
        this.gameOver = false;
        this.title = true;
        this.loaded = false;
        this.credits = false;
        this.level = null;
        this.menuSelect = {
            play: false
        }
        this.menuSelectIndex = -10;
        this.creditsLineIndex = 0;
        this.menuButtonTimer = 0.15;
        this.menuButtonCooldown = 0.15;
    }

    clearEntities(gameEngine) {
        gameEngine.entities.forEach(entity => {
            if (entity === this) return;
            entity.removeFromWorld = true;
        });
    }

    loadTitle(gameEngine) {
        let screen = new Icon(assetManager.getAsset("./resources/pixel_landscape_1.jpg"),
		0, 0, canvas.width, canvas.height);
        screen.z = 8;
	    let begin = new Icon(assetManager.getAsset("./resources/Play.png"), canvas.width/2 - 150, canvas.height/2 - 40, 300, 80);
        begin.z = 9;
	    gameEngine.addEntity(screen);
	    gameEngine.addEntity(begin);
    }

    loadLevelOne(gameEngine) {
        const entities = [];

        const shepherd = new Shepherd(1200, 800);
        //const shepherd = new Shepherd(canvas.width / 2, canvas.height / 2);
        params.debugEntities.shepherd = shepherd;

        entities.push(shepherd);
        for (let i = 0; i < 25; i++) {
            let x = randomInt(canvas.width * 2);
            let y = randomInt(canvas.height * 2);
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

        const miniMap = new MiniMap([mainEnvironment], camera);
        entities.push(miniMap);
        //const cooldown = new CooldownTimer(50, 50, 100, 100);
        //entities.push(cooldown);
        const fenceIcon = new Icon(assetManager.getAsset("./resources/fence_horizontal.png"), 50, 50, 50, 50, "1");
        const fireIcon = new Icon(assetManager.getAsset("./resources/fireicon.png"), 100, 50, 50, 50, "2");
        const treeIcon = new Icon(assetManager.getAsset("./resources/pinetree.png"), 150, 50, 50, 50, "3");
        entities.push(fenceIcon);
        entities.push(fireIcon);
        entities.push(treeIcon);
        gameEngine.addEntities(entities);
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

    update(gameEngine) {
        super.update(gameEngine);
        if (this.title) {
            if (!this.loaded) {
                this.loadTitle(gameEngine);
                this.loaded = true;
            }
            let click = gameEngine.click;
            if (click && click.x > canvas.width/2 - 150 && click.x < canvas.width/2 + 150
                && click.y > canvas.height/2 - 40 && click.y < canvas.height/2 + 40) {
                this.clearEntities(gameEngine);
                this.title = false;
                this.loaded = false;
                this.loadLevelOne(gameEngine);
            }
        } else if (this.credits) {
            if (!this.loaded) {
                this.clearEntities(gameEngine);
                this.loadCredits(gameEngine);
                this.loaded = true;
            }
        }

    }
}