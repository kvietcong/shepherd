const gameEngine = new GameEngine();
const assetManager = new AssetManager();

const resizeCanvas = canvas => {
	canvas.width = round(document.documentElement.clientWidth * 0.75);
	canvas.height = round(canvas.width / (16 / 9));
	return canvas;
};

const initializeCanvas = () => {
	const canvas = document.createElement("canvas");
	document.getElementById("canvas-container").appendChild(canvas);
	canvas.style.border = "1px solid black";
	//let idk2 = new Image(96, 96);
	//idk2.src = "./resources/Map_tiles.png";
	canvas.style.background = "url('./resources/forest.jpg')";
	canvas.autofocus = true;
	canvas.tabIndex = 0;
	resizeCanvas(canvas);
	return canvas;
};

const canvas = initializeCanvas();

assetManager.queueDownload("./resources/wolf.png");
assetManager.queueDownload("./resources/shepherd.png")
assetManager.queueDownload("./resources/sheep.png")
assetManager.queueDownload("./resources/1.png");
assetManager.queueDownload("./resources/2.png");
assetManager.queueDownload("./resources/3.png");
assetManager.queueDownload("./resources/starDewBuildings.png");
assetManager.queueDownload("./resources/Map_tiles.png");
assetManager.queueDownload("./resources/slash.png")
assetManager.queueDownload("./resources/fence_00.png")
assetManager.queueDownload("./resources/No Worries.mp3")
assetManager.queueDownload("./resources/Kevin MacLeod - Pixelland.mp3")


assetManager.downloadAll(() => {
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);

	const entities = [];
	const shepherd = new Shepherd(1700, 900);
	//const shepherd = new Shepherd(canvas.width / 2, canvas.height / 2);
	params.debugEntities.shepherd = shepherd;

	entities.push(shepherd);
	for (let i = 0; i < 25; i++) {
		let x = randomInt(canvas.width * 2);
		let y = randomInt(canvas.height * 2);
		if (i % 4 === 0) {
			entities.push(new Wolf(x, y));
		}
		entities.push(new Sheep(x, y));
	}
	/*
	//sample obstacles
	let house = new Obstacle(195, 99, "./resources/3.png");
	entities.push(house);
	let house2 = new Obstacle(387, 380, "./resources/3.png");
	entities.push(house2);
	entities.push(new Obstacle(290, 860, "./resources/2.png"));
	entities.push(new Obstacle(773, 577, "./resources/1.png"));
	//barn
	entities.push(new Obstacle(570, 1100, "./resources/starDewBuildings.png", 130, 0, 111, 105, 2));
	//silo
	entities.push(new Obstacle(540, 1077, "./resources/starDewBuildings.png", 390, 0, 47, 127, 1));
	//well
	entities.push(new Obstacle(600, 1000, "./resources/starDewBuildings.png", 453, 33, 47, 74, 1));
	//bridge posts
	entities.push(new Obstacle(670, 775, "./resources/Map_tiles.png", 289, 252, 4, 40, 2.5));
	entities.push(new Obstacle(958, 775, "./resources/Map_tiles.png", 289, 252, 4, 40, 2.5));
	*/
	//new image object for tile set
	let idk = new Image(96, 96);
	idk.src = "./resources/Map_tiles.png";

	let forestSourceImage = new Image(629, 679);
	forestSourceImage.src = "./resources/forestground.png";

	let forestWaterImage = new Image(410, 331);
	forestWaterImage.src = "./resources/forestwater.png";
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
	let woodTile = {
		x: 294,
		y: 335,
		width: 14,
		image: idk
	}
	let forestMudTile = {
		x: 286,
		y: 512,
		width: 31,
		image: forestSourceImage
	}
	let forestFlowerTile = {
		x: 96,
		y: 480,
		width: 31,
		image: forestSourceImage
	}
	let forestTile = {
		x: 64,
		y: 0,
		width: 32,
		image: forestWaterImage
	}
	//assemble tileData array
	let tileData = [];
	tileData["default"] = grassTile;
	tileData["grassEdge"] = grassTileEdge;
	tileData["lightGrass"] = lightGrassTile;
	tileData["lightGrassEdge"] = lightGrassTileEdge;
	tileData["water"] = waterTile;
	tileData["wood"] = woodTile;
	tileData["forest"] = forestTile;
	tileData["forestFlower"] = forestFlowerTile;
	tileData["forestMud"] = forestMudTile;

	//find tile size
	const tileWidth = 96;
	//tiles needed to cover the play area with current tile width
	let xTile = 25; //canvas.width*2 / tileWidth - 1;
	let yTile = 25; //canvas.height*2 / tileWidth;

	//current availble map types: "Test"-original map, "Forest"-currently under construction
	let importedMap = new Map("Forest");
	const mainEnvironment = new Environment(xTile, yTile, tileData, -1, importedMap);
	entities.push(mainEnvironment);

	//new background tileData
	//let backgroundTileData = [];
	//backgroundTileData["default"] = waterTile;
	//const backgroundEnvironment = new Environment(xTile, yTile, backgroundTileData, -2)
	//entities.push(backgroundEnvironment);

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

	gameEngine.addEntities(entities);
	gameEngine.start();
});

const toggleWorldBorder = () =>
	gameEngine.options.hasWorldBorder = !gameEngine.options.hasWorldBorder;

const resetTarget = () => gameEngine.camera
	.setPosition(gameEngine.width / 2, gameEngine.height / 2);

const resetZoom = () => gameEngine.camera.zoom = 1;

const resetCamera = () => { resetTarget(); resetZoom(); };

// Event Hooks
window.addEventListener("resize", () => { resizeCanvas(canvas) });

const alignmentInput = document.getElementById("alignment");
const shepAlignmentInput = document.getElementById("shep-alignment");
const wolfRepelInput = document.getElementById("wolf-repel");
const cohesionInput = document.getElementById("cohesion");
const separationInput = document.getElementById("separation");


alignmentInput.value = params.sheep.alignmentFactor;
//alignmentInput.value = params.sheep.shepAlignmentInput
cohesionInput.value = params.sheep.cohesionFactor;
separationInput.value = params.sheep.separationFactor;

alignmentInput.addEventListener("change", event => {
	let { value } = event.target;
	if (value < 1) {
		value = 1;
		alignmentInput.value = value;
	}
	params.sheep.alignmentFactor = value;
});
cohesionInput.addEventListener("change", event => {
	let { value } = event.target;
	if (value < 1) {
		value = 1;
		cohesionInput.value = value;
	}
	params.sheep.cohesionFactor = value;
});
separationInput.addEventListener("change", event => {
	let { value } = event.target;
	if (value < 1) {
		value = 1;
		separationInput.value = value;
	}
	params.sheep.separationFactor = value;
});

const resetFactors = () => {
	separationInput.value = params.sheep.separationFactor = 18;
	cohesionInput.value = params.sheep.cohesionFactor = 10;
	alignmentInput.value = params.sheep.alignmentFactor = 300;
};

const debugInput = document.getElementById("debug");
debugInput.checked = params.isDebugging;
debugInput.addEventListener("change", event => {
	params.isDebugging = event.target.checked;
});