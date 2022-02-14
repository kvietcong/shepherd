const gameEngine = new GameEngine();
const assetManager = new AssetManager();
const sceneManager = new SceneManager();

const resizeCanvas = canvas => {
	const main = document.getElementsByTagName("main")[0];
	canvas.width = round(main.clientWidth * 0.65);
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
const inventory = new Inventory(100, 5, 5, 1);
console.log("gold: " + inventory.gold);

assetManager.queueDownload("./resources/pixel_landscape_1.jpg");
assetManager.queueDownload("./resources/Play.png");
assetManager.queueDownload("./resources/wolf.png");
assetManager.queueDownload("./resources/shepherd.png")
assetManager.queueDownload("./resources/sheep.png")
assetManager.queueDownload("./resources/1.png");
assetManager.queueDownload("./resources/2.png");
assetManager.queueDownload("./resources/3.png");
assetManager.queueDownload("./resources/starDewBuildings.png");
assetManager.queueDownload("./resources/forestwater.png");
assetManager.queueDownload("./resources/big_tree.png");
assetManager.queueDownload("./resources/treetrunk.png");
assetManager.queueDownload("./resources/forestground.png");
assetManager.queueDownload("./resources/Map_tiles.png");
assetManager.queueDownload("./resources/slash.png");
assetManager.queueDownload("./resources/fence_00.png");
assetManager.queueDownload("./resources/fence_vertical.png");
assetManager.queueDownload("./resources/fence_horizontal.png");
assetManager.queueDownload("./resources/fireicon.png");
assetManager.queueDownload("./resources/campfire.png");
assetManager.queueDownload("./resources/pinetree.png");
assetManager.queueDownload("./resources/No Worries.mp3");
assetManager.queueDownload("./resources/Kevin MacLeod - Pixelland.mp3");
assetManager.queueDownload("./resources/sheep_baa.mp3");
assetManager.queueDownload("./resources/level_completed.png");


assetManager.downloadAll(() => {
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);
	gameEngine.addEntity(sceneManager);
	gameEngine.start();
});

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

const pausePlay = () => gameEngine.isPaused = !gameEngine.isPaused;
const pausePlayButton = document.getElementById("pause-play");
setInterval(() => {
	const { isPaused } = gameEngine;
	pausePlayButton.innerText = `${isPaused ? "Play" : "Pause"} Game`;
}, 1000);