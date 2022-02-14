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
        const shepherd = new Shepherd(canvas.width / 2, canvas.height / 2);
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

        //sample obstacles
        let house = new Obstacle(195, 99, "./resources/3.png");
        entities.push(house);
        let house2 = new Obstacle(387, 380, "./resources/3.png");
        entities.push(house2);
        entities.push(new Obstacle(290, 860, "./resources/2.png"));
        entities.push(new Obstacle(773, 577, "./resources/1.png"));

        //new image object for tile set
        let idk = new Image(96, 96);
        idk.src = "./resources/Map_tiles.png";
        //new tile object
        let grassTile = {
            x: 97,
            y: 1,
            width: 79,
            image: idk
        }
        let grassTileEdge = {
            x: 97,
            y: 1,
            width: 90,
            image: idk
        }
        let waterTile = {
            x: 0,
            y: 0,
            width: 96,
            image: idk
        }
        let lightGrassTile = {
            x: 289,
            y: 1,
            width: 79,
            image: idk
        }
        let lightGrassTileEdge = {
            x: 289,
            y: 1,
            width: 90,
            image: idk
        }
        //assemble tileData array
        let tileData = [];
        tileData["default"] = grassTile;
        tileData["grassEdge"] = grassTileEdge;
        tileData["lightGrass"] = lightGrassTile;
        tileData["lightGrassEdge"] = lightGrassTileEdge;
        tileData["water"] = waterTile;

        //find tile size
        const tileWidth = 96;
        //tiles needed to cover the play area with current tile width
        let xTile = canvas.width*2 / tileWidth - 1;
        let yTile = canvas.height*2 / tileWidth;

        const mainEnvironment = new Environment(xTile, yTile, tileData, -1);
        entities.push(mainEnvironment);

        //new background tileData
        let backgroundTileData = [];
        backgroundTileData["default"] = waterTile;
        const backgroundEnvironment = new Environment(xTile, yTile, backgroundTileData, -2)
        entities.push(backgroundEnvironment);
        
        //const cooldown = new CooldownTimer(50, 50, 100, 100);
        //entities.push(cooldown);
        const fenceIcon = new Icon(assetManager.getAsset("./resources/fence_horizontal.png")
            , 50, 25, 50, 50, params.inventory.fenceCost);
        const fireIcon = new Icon(assetManager.getAsset("./resources/fireicon.png")
            , 100, 25, 50, 50, params.inventory.torchCost);
        const treeIcon = new Icon(assetManager.getAsset("./resources/pinetree.png"), 150, 25, 50, 50, "20");
        const goldIcon = new Icon(assetManager.getAsset("./resources/coin_01.png"), 450, 25, 50, 50);
        const goldText = new GoldText(500, 65, 85, 40);
        entities.push(fenceIcon);
        entities.push(fireIcon);
        entities.push(treeIcon);
        entities.push(goldIcon);
        entities.push(goldText);
        const camera = new Camera(gameEngine.width / 2, gameEngine.height / 2);
        camera.follow(shepherd);
        gameEngine.setCamera(camera);

        const miniMap = new MiniMap([backgroundEnvironment, mainEnvironment], camera);
        entities.push(miniMap);
        
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