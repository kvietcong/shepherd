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
	canvas.style.background = "white";
	canvas.autofocus = true;
	canvas.tabIndex = 0;
	resizeCanvas(canvas);
	return canvas;
};

const canvas = initializeCanvas();

assetManager.queueDownload("./resources/wolf.png");
assetManager.queueDownload("./resources/shepherd.png")
assetManager.queueDownload("./resources/sheep.png")
assetManager.queueDownload("./resources/No Worries.mp3")
assetManager.queueDownload("./resources/Kevin MacLeod - Pixelland.mp3")


assetManager.downloadAll(() => {
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);

	const entities = [];
	const shepherd = new Shepherd(canvas.width / 2, canvas.height / 2);
	entities.push(shepherd);
	for (let i = 0; i < 25; i++) {
		let x = randomInt(canvas.width * 2);
		let y = randomInt(canvas.height * 2);
		if (i % 4 === 0) {
			entities.push(new Wolf(x, y));
		}
		entities.push(new Sheep(x, y, shepherd));
	}

	//new image object for tile set
	let idk = new Image(96, 96);
	idk.src = "./resources/Map_tiles.png";
	//new tile object
	let grassTile = {
		x: 96,
		y: 0,
		width: 96,
		height: 96,
		image: idk
	}
	let waterTile = {
		x: 0,
		y: 0,
		width: 96,
		image: idk
	}
	let lavaTile = {
		x: 0,
		y: 256,
		width: 96,
		image: idk
	}
	//assemble tileData array
	let tileData = [];
	tileData["default"] = grassTile;
	tileData["water"] = waterTile;
	tileData["lava"] = lavaTile;

	//find tile size
	const tileWidth = 96;
	//tiles needed to cover the play area with current tile width
	let xTile = canvas.width*2 / tileWidth - 1;
	let yTile = canvas.height*2 / tileWidth;

	entities.push(new Environment(xTile, yTile, tileData));

	gameEngine.addEntities(entities);

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